<template>
  <div class="hello">
    <img class="prof" v-if="about.image" :src="'ssb-blob://' + encodeURIComponent(about.image)" />
    <h1 v-if="about.name">Hello {{about.name}}!</h1>
    <h1 v-else>Hello!</h1>
    <form v-on:submit.prevent="send">
      <textarea v-model="message">
      </textarea>
      <button type="submit">Send message</button>
    </form>
    <div class="posts" v-for="post in posts">
      <div class="post" :title="post.raw">
        {{post.text}}
      </div>
    </div>
  </div>
</template>

<script>

import pull from 'pull-stream'

function update(data, message) {
  if(message.value && message.value.content) {
    switch(message.value.content.type) {
      case 'post':
        data.posts.push({ text: message.value.content.text, raw: JSON.stringify(message) })
        break
      case 'about':
        if(message.value.content.about === data.me.id) {
          Object.assign(data.about, message.value.content)
        }
        break
      case 'channel':
      case 'contact':
      case 'pub':
      case 'vote':
        break
      default:
        data.posts.push({ text: JSON.stringify(message) })
        break
    }
  } else {
    data.posts.push({ text: JSON.stringify(message) })
  }
}

async function attach(ssb, data) {
  data.me = await ssb.whoami()
  pull(
    ssb.createUserStream({id: data.me.id, live: true}),
    pull.drain(message => update(data, message)))
}

export default {
  name: 'About',
  data () {
    var dat = {
      posts: [],
      about: {},
      value: null,
      me: null,
      message: ''
    }

    attach(this.$ssb, dat)
    return dat
  },
  methods: {
    send () {
      var msg = { channel: "TEST", type: 'post', text: this.message }

      var cb = (err, val) => {
        if (err)
          console.error(err)
        console.log(val)
      }

      this.$ssb.publish(msg, cb)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
a {
  color: #42b983;
}
.post {
  margin-bottom: 30px;
  overflow-wrap: break-word;
  text-align: left;
  clear: both;
}
.prof {
  width: 200px;
  height: 200px;
}

textarea {
  width: 100%;
}
</style>
