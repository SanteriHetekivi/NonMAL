var mongoose = require('mongoose')
var popura = require('popura')
var Schema = mongoose.Schema

const NAMES_FOR_FIELDS = {
  _id: '_id',
  title: 'title',
  series_title: 'title',
  series_mangadb_id: 'series_mangadb_id',
  chapter: 'chapter',
  chapters: 'chapter',
  my_read_chapters: 'chapter',
  volume: 'volume',
  volumes: 'volume',
  my_read_volumes: 'volume',
  status: 'status',
  my_status: 'status',
  score: 'score',
  my_score: 'score'
}

const DB_TO_MAL_FIELD = {
  chapter: 'chapter',
  chapters: 'chapter',
  volume: 'volume',
  volumes: 'volume',
  status: 'status',
  score: 'score'
}

const MANGA_FIELDS = {
  title: {
    type: String
  },
  series_mangadb_id: {
    type: Number
  },
  chapter: {
    type: Number
  },
  volume: {
    type: Number
  },
  status: {
    type: Number
  },
  score: {
    type: Number
  }
}

var MangaSchema = new Schema(
  MANGA_FIELDS
)

class Manga {
  constructor (username, password) {
    this.username = username
    this.MAL = popura(username, password)
  }

  MakeDB () {
    this.DB = mongoose.model(
      this.username + '_Manga',
      MangaSchema,
      this.username + '_Mangas'
    )
  }

  Search (name, success, failure) {
    var mangas = []
    var self = this
    this.FindNonMAL(name,
      (newMangas) => {
        self.FindMAL(name,
          success,
          failure,
          newMangas
        )
      },
      failure,
      mangas
    )
  }

  FindMAL (name, success, failure, mangas = []) {
    var self = this
    this.MAL.searchMangas(name)
      .then(
        (MALMangas) => {
          var MALMangasCount = MALMangas.length
          var MALMangasHandeledCounter = 0
          MALMangas = MALMangas.filter(function (e) { return e })
          if (MALMangas.length <= 0) {
            success(mangas)
          }
          MALMangas.forEach(
            (manga) => {
              self.DB.findOne(
                { series_mangadb_id: manga.id },
                (err, dbManga) => {
                  if (err) {
                    failure(err)
                  }
                  if (dbManga === null) {
                    manga.chapter = 0
                    manga.volume = 0
                    manga.status = 0
                    manga.score = 0
                  } else {
                    manga.chapter = dbManga.chapter
                    manga.volume = dbManga.volume
                    manga.status = dbManga.status
                    manga.score = dbManga.score
                  }
                  mangas.push(manga)
                  ++MALMangasHandeledCounter
                  if (MALMangasHandeledCounter === MALMangasCount) {
                    success(mangas)
                  }
                }
              )
            }
          )
        }
      )
      .catch(failure)
  }

  FindNonMAL (name, success, failure, mangas = []) {
    this.DB.find(
      {
        series_mangadb_id: 0,
        title: { '$regex': name, '$options': 'i' }
      },
      (err, dbMangas) => {
        if (err) {
          failure(err)
        }
        success(mangas.concat(dbMangas))
      }
    )
  }

  Run (_func, failure) {
    this.MAL.verifyAuth()
      .then(
        (data) => {
          if (data.username === this.username) {
            _func()
          } else {
            failure()
          }
        }
      )
      .catch(failure)
  }

  List (success, failure) {
    this.MAL.getMangaList()
      .then(success)
      .catch(failure)
  }

  SaveList (success, failure) {
    this.DB.remove({ series_mangadb_id: { $gt: 0 } },
      (err) => {
        if (err) {
          failure(err)
        } else {
          this.MAL.getMangaList()
            .then(
              (mangaList) => {
                this.MangaListToDB(mangaList, success, failure)
              }
            )
            .catch(failure)
        }
      }
    )
  }

  Clear (success, failure) {
    this.DB.remove({},
      (err) => {
        if (err) {
          failure(err)
        } else {
          success()
        }
      }
    )
  }

  MangaListToDB (mangaList, success, failure) {
    var mangaCount = mangaList.list.length
    var self = this
    var updatedCount = 0
    var successCount = 0
    var errors = {}

    mangaList.list.forEach(
      listManga => {
        self.AddManga(
          listManga,
          () => {
            ++updatedCount
            ++successCount
            if (updatedCount >= mangaCount) {
              if (successCount === mangaCount) {
                success()
              } else {
                failure(errors)
              }
            }
          },
          err => {
            ++updatedCount
            errors.push(err)
            if (updatedCount >= mangaCount) {
              if (successCount === mangaCount) {
                success()
              } else {
                failure(errors)
              }
            }
          },
          false
        )
      }
    )
  }

  ToDBManga (manga) {
    var row = {}
    for (var name in manga) {
      if (name in NAMES_FOR_FIELDS) {
        row[NAMES_FOR_FIELDS[name]] = manga[name]
      }
    }
    return row
  }

  ToMALManga (manga) {
    var row = {}
    for (var name in manga) {
      if (name in DB_TO_MAL_FIELD) {
        row[DB_TO_MAL_FIELD[name]] = manga[name]
      }
    }
    return row
  }

  AddManga (manga, success, failure, setToMAL = true) {
    manga = this.ToDBManga(manga)
    var idSet = ('_id' in manga)
    var MALIdSet = ('series_mangadb_id' in manga && manga.series_mangadb_id > 0)
    var condition = {}
    if (idSet && manga._id.length > 0) {
      condition = { _id: manga._id }
    } else if (MALIdSet) {
      condition = { series_mangadb_id: manga.series_mangadb_id }
    } else if ('title' in manga && manga.title.length > 0) {
      condition = { title: manga.title }
    } else {
      return false
    }

    if (idSet && manga._id.length <= 0) {
      delete manga._id
    }

    this.DB.findOneAndUpdate(
      condition,
      manga,
      {
        upsert: true,
        passRawResult: true
      },
      (err, writeOpResult) => {
        if (err) {
          failure(err)
        } else if (setToMAL) {
          this.MangaToMAL(manga, (writeOpResult === null), success, failure)
        } else {
          success()
        }
      }
    )
  }

  MangaToMAL (manga, isNew, success, failure) {
    // Is MAL manga
    if ('series_mangadb_id' in manga && manga.series_mangadb_id > 0) {
      var id = manga.series_mangadb_id
      var malManga = this.ToMALManga(manga)
      if (isNew) {
        this.MAL.addManga(id, malManga)
          .then(success)
          .catch(
            err => {
              this.DB.remove({ series_mangadb_id: id }, () => { failure(err) })
            }
          )
      } else {
        this.MAL.updateManga(id, malManga)
          .then(success)
          .catch(failure)
      }
    } else {
      success()
    }
  }
}

module.exports = Manga
