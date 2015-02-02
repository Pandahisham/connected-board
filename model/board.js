var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var BoardSchema = new Schema({
  uid:String,
  element: Schema.Types.Mixed
});

mongoose.model('Board', BoardSchema);
