'use strict';
const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init({
    title: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          msg: 'What is the name of the book?'
        }
      }
    },
    author: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: {
              msg: 'Who wrote the book?'
            }
          }
    },
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER
  }, { sequelize });

  return Book;
};
