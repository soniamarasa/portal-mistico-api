import mongoose from 'mongoose';

const tarotReadingSchema = mongoose.Schema({
  userId: String,
  date: Date,
  type: Object,
  cards: Array,
  title: String,
  description: String,
});

const tarotReadingModel = mongoose.model('tarotReading', tarotReadingSchema);

export default tarotReadingModel;
