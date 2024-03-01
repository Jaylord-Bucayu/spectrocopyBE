import mongoose, { Schema, Document,Types } from 'mongoose';

interface I extends Document {
  channels: number[];
  created_by?: Types.ObjectId;
}

const resultSchema: Schema<I> = new Schema<I>(
  {
    channels: {
      type: [Number],
      default: [],
    },
    created_by: {
      type: Types.ObjectId,
      ref: 'User',
    },
    actual_moisture:{
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

resultSchema.virtual('id').get(function (this: I) {
  return this._id?.toHexString();
});

resultSchema.set('toJSON', {
  virtuals: true,
  transform: function (_, ret) {
    const newRet = { id: ret._id };
    delete ret._id;
    delete ret.__v;
    Object.assign(newRet, ret);
    return newRet;
  }
});

resultSchema.post('save', async () => {
  // Your post-save logic here
});

const ResultModel = mongoose.model<I>('Results', resultSchema);
export default ResultModel;
