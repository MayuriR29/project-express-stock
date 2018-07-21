const WatchList = require("../models/watchlist");

const checkDuplicateTickers = async (tickers, userId) => {
  const tickersFoundInUserWatchList = await WatchList.findTickersByUser(userId);

  if (tickersFoundInUserWatchList.length === 0) return [];
  if (Array.isArray(tickers)) {
    const duplicated = tickers.filter(
      ticker => tickersFoundInUserWatchList.indexOf(ticker.toUpperCase()) !== -1
    );
    return duplicated;
  }
  return tickersFoundInUserWatchList.indexOf(tickers.toUpperCase()) === -1
    ? []
    : tickers;
};

const createWatchListForUser = async (ticker, user) => {
  const watchlist = new WatchList({
    ticker,
    user: user._id
  });
  await watchlist.save();
};
const createWatchListsFromRequest = async (tickers, user) => {
  if (Array.isArray(tickers)) {
    let promises = tickers.map(ticker => createWatchListForUser(ticker, user));
    await Promise.all(promises);
  } else {
    await createWatchListForUser(tickers, user);
  }
};

module.exports = {
  checkDuplicateTickers,
  createWatchListsFromRequest
};
