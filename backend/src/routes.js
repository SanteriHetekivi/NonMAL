const express = require('express')
const jwt = require('express-jwt')
const Manga = require('./models/Manga')
const jsonwebtoken = require('jsonwebtoken')

var router = express.Router()

const JWT = jwt({ secret: process.env.APIKEY })
function checkAuth (req, res, func) {
  var manga = new Manga(req.user.username, req.user.password)
  manga.Run(
    () => {
      manga.MakeDB()
      try {
        func(manga)
      } catch (err) {
        console.log(err)
        res.status(400).send('Error')
      }
    },
    (err) => {
      console.log(err)
      res.status(401).send('Unauthorised')
    }
  )
}

/**
 * Login request
 */
router.post('/login',
  (req, res, next) => {
    const { username, password } = req.body
    new Manga(username, password).Run(
      () => {
        const token = jsonwebtoken.sign(
          {
            username: username,
            password: password
          },
          process.env.APIKEY,
          {
            expiresIn: '1d'
          }
        )
        res.json(
          {
            token: token
          }
        )
      },
      () => {
        res.status(401).send('Unauthorised')
      }
    )
  }
)

router.get('/list', JWT,
  (req, res) => {
    checkAuth(
      req, res,
      (manga) => {
        manga.List(
          list => {
            res.json(list)
          },
          err => {
            console.log(err)
            res.status(400).send('unable to load mangalist')
          }
        )
      }
    )
  }
)

router.get('/search/:name', JWT,
  (req, res) => {
    checkAuth(
      req, res,
      (manga) => {
        manga.Search(
          req.params.name,
          mangas => {
            try {
              res.json(mangas)
            } catch (err) {
              console.log(err)
              res.status(400).send('unable to load mangalist')
            }
          },
          err => {
            console.log(err)
            res.status(400).send('unable to load mangalist')
          }
        )
      }
    )
  }
)

router.get('/saveList', JWT,
  (req, res) => {
    checkAuth(
      req, res,
      (manga) => {
        manga.SaveList(
          () => {
            res.json({ success: true })
          },
          (err) => {
            console.log(err)
            res.status(400).send('unable to save mangalist')
          }
        )
      }
    )
  }
)

router.get('/clear', JWT,
  (req, res) => {
    checkAuth(
      req, res,
      (manga) => {
        manga.Clear(
          () => {
            res.json({ success: true })
          },
          (err) => {
            console.log(err)
            res.status(400).send('unable to clear mangalist')
          }
        )
      }
    )
  }
)

// Add item
router.put('/manga', JWT,
  (req, res) => {
    checkAuth(
      req, res,
      (manga) => {
        manga.AddManga(
          req.body,
          () => {
            res.status(201).send('Saved')
          },
          (err) => {
            console.log(err)
            res.status(400).send('unable to save to database')
          }
        )
      }
    )
  }
)

module.exports = router
