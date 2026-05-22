const { model } = require("mongoose");
const { FundsSchema } = require("../schemas/FundsSchema");

const FundsModel = model("Funds", FundsSchema);

module.exports = { FundsModel };
