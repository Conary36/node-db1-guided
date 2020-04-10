const express = require('express');

// database access using knex
const db = require('../data/db-config.js');

const router = express.Router();

// api/posts
router.get('/', (req, res) => {
    db.select().from('posts')
        .then(posts => {
            res.json(posts);
        })
        .catch(err => {
            res.status(500).json({message: "error retrieving posts", err})
        });
});
// api/posts
router.get('/:id', (req, res) => {
    const {id} = req.params;
    db.select()
        .from('posts')
        .where({id})
        .first()//Returns data as an object NOT AN ARRAY!
        .then(post => res.status(200).json(post))
        .catch(err => res.status(500).json({message: err.message}))

});

router.post('/', (req, res) => {
    const postData = req.body;
    db('posts')
        .insert(postData)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(err => {
            res.status(500).json({message: 'failed to create new posts', err});
        })

});

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    db('posts')
        .where({id})
        .update(changes)
        .then(count =>{
            if(count){
                res.json({updated: count})
            }else{
                res.status(404).json({message: 'Invalid id'});
            }
        })
        .catch(err => {
            res.status(500).json({message: "error updating", err})
        })
});

router.delete('/:id', (req, res) => {
    const {id} = req.params;
    const item = req.body;
    db('posts')
        .where({id})
        .del(item)
        .then(e =>{
            if(e > 0 ){
                res.status(200).json({message: 'Deleted!'})
            }else{
                res.status(404).json({message: 'Not Found!'})//always include 404 to ensure the item does exist or not.
            }
        })
        .catch(err => {
            res.status(500).json({message: 'No luck, Try again!'})
        })
});

module.exports = router;