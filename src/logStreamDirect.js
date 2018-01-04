import http from 'stream-http'
import ndjson from 'ndjson'
import Pushable from 'pull-pushable'

function createLogStream(opts) {
  var start
  if (opts.gt) {
    start = opts.gt
  }

  var source = Pushable()
  function next (max) {
    getLogStreamChunk(source, max, 1000, next)
  }

  next(start)
  return source
}

function getLogStreamChunk(pushable, start, limit, cb) {
  var headers = {
    limit
  }

  var query = 'limit=' + limit
  if(start) {
    headers['start'] = start
    query = query + '&start=' + start
  }

  var opts = {
		path: 'http://localhost:8080/$$$?'+query,
		headers
  }

  var max = start || 0

  http.get(opts, res => {
    res.pipe(ndjson.parse())
    .on('data', function(msg) {
      if(msg && msg.timestamp && msg.timestamp > max) {
        max = msg.timestamp
      }
      pushable.push(msg)
    }).on('end', function(end) {
      console.log(max)
      setTimeout(() => cb(max), 500)
    })
  })
}

export default {
  version: '1.0.0',
  manifest: {
    createLogStream: 'source'
  },
  init: function (ssb, config) {
    ssb.createLogStream = createLogStream

    return {
      // merge in replacement for createLogStream
      createLogStream
    }
  }
}
