import afterparty from 'ssb-afterparty'
import {pullParent} from 'ssb-afterparty/channels/worker'
import about from 'ssb-about'

afterparty(pullParent('toPipe'), pullParent('fromPipe')).then(
  function(sbot) {
    sbot.use(about)
    sbot()
  }, function (err) {

  }
)
