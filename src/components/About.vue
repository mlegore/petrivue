<template>
  <div class="hello">
    <img class="prof" v-if="about.image" :src="'ssb-blob://' + about.image" />
    <h1 v-if="about.name">Hello {{about.name}}!</h1>
    <h1 v-else>Hello!</h1>

    <div class="posts" v-for="post in posts">
      <div class="post">
        {{post}}
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
        data.posts.push(message.value.content.text)
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
        data.posts.push(JSON.stringify(message))
        break
    }
  } else {
    data.posts.push(JSON.stringify(message))
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
      me: null
    }

    attach(this.$ssb, dat)
    return dat
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
</style>
