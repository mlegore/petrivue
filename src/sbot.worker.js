import afterparty from 'ssb-afterparty'
import {pullParent} from 'ssb-afterparty/channels/worker'
import toPullStream from 'stream-to-pull-stream'
import ParentStream from 'workerstream-channel/parent'
import about from 'ssb-about'
import logStreamDirect from './logStreamDirect'

var toPipe = ParentStream(self, 'toPipe')
var opts = {
  dir: '_'
}

afterparty(toPullStream.duplex(toPipe), pullParent('fromPipe'), opts).then(
  function(sbot) {
    sbot.use(logStreamDirect)
      .use(about)
    sbot()
  }, function (err) {
    console.error(err)
  }
)
