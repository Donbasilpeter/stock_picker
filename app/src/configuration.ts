export default () => ({
  BseApiconfig: {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Mobile Safari/537.36',

      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9,hi;q=0.8,ml;q=0.7',
    },
  },
  bseBaseUrl: 'https://api.bseindia.com/BseIndiaAPI/api/StockReachGraph/w',
});
