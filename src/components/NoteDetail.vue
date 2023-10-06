<template>
  <div id="note" class="detail">
    <note-sidebar  @update:notes="val => notes = val"></note-sidebar>
    <div class="note-detail">
      <div class="note-empty" v-show="!curNote.id">请选择笔记</div>
      <div class="note-detail-ct" v-show="curNote.id">
        <div class="note-bar">
          <span> 创建日期: {{curNote.createdAtFriendly}}</span>
          <span> 更新日期: {{curNote.updatedAtFriendly}}</span>
          <span> {{statusText}}</span>
          <span class="iconfont icon-delete" @click="deleteNote"></span>
          <span class="iconfont icon-fullscreen" @click="isShowPreview = !isShowPreview"></span>
        </div>
        <div class="note-title">
          <input type="text" v-model:value="curNote.title" @input="updateNote" @keydown="statusText='正在输入...'" placeholder="输入标题">
        </div>
        <div class="editor">
          <textarea v-show="isShowPreview"  v-model:value="curNote.content" @input="updateNote" @keydown="statusText='正在输入...'" placeholder="输入内容, 支持 markdown 语法"></textarea>
          <div class="preview markdown-body" v-html="previewContent" v-show="!isShowPreview">
          </div>
        </div>
      </div>

    </div>
  </div>

</template>

<script>
import Auth from '@/apis/auth'
import NoteSidebar from '@/components/NoteSidebar'
import Bus from '@/helpers/bus'
import _ from 'lodash'
import Notes from '@/apis/notes'
import MarkdownIt from 'markdown-it'

let md = new MarkdownIt()


export default {
  components: {
    NoteSidebar
  },
  
  data () {
    return {
      curNote: {},
      notes: [],
      statusText: '笔记未改动',
      isShowPreview: false
    }
  },

  created() {
    Auth.getInfo()
      .then(res => {
        if(!res.isLogin) {
          this.$router.push({ path: '/login' })
        }
      })
    Bus.$once('update:notes', val => {
      this.curNote = val.find(note => note.id == this.$route.query.noteId) || {}
    })
  },

  computed: {
    previewContent() {
      console.log(this.curNote.content||'')
      return md.render(this.curNote.content||'')
    }
  },

  methods: {
    updateNote: _.debounce(function() {
      Notes.updateNote({ noteId: this.curNote.id }, 
        { title: this.curNote.title, content: this.curNote.content })
        .then(data => {
          this.statusText = '已保存'
        }).catch(data => {
          this.statusText = '保存出错'
        })

    }, 300),

    deleteNote() {
      Notes.deleteNote({ noteId: this.curNote.id })
        .then(data => {
          this.$message.success(data.msg)
          this.notes.splice(this.notes.indexOf(this.curNote), 1)
          this.$router.replace({ path: '/note' })
        })
    }
    
  },

  beforeRouteUpdate (to, from, next) {
    this.curNote = this.notes.find(note => note.id == to.query.noteId) || {}
    next()
  }
}
</script>

<style lang="less">

.note-detail {
  flex: 1;
  display: flex;
  flex-direction: column;

  .note-detail-ct {
    height: 100%;
  }

  .note-empty {
    font-size: 50px;
    color: #ccc;
    text-align: center;
    margin-top: 100px;
  }

  .note-bar {
    padding: 4px 20px;
    border-bottom: 1px solid #eee;
    &:after {
      content:'';
      display: block;
      clear: both;
    }
    span {
      font-size: 12px;
      color: #999;
      margin-right: 4px;
    }
    .iconfont{
      float: right;
      margin-left: 4px;
      font-size: 18px;
      cursor: pointer;
    }

  }

  .note-title{
    input,span {
      display: inline-block;
      width: 100%;
      border: none;
      outline: none;
      font-size: 18px;
      padding: 10px 20px;
    }
  }

  .editor {
    height: ~"calc(100% - 70px)";
    position: relative;
  }
  textarea, .preview {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 20px;
  }

  textarea {
    border: none;
    resize: none;
    outline: none;
    font-size: 14px;
    font-family: 'Monaco', courier, monospace;
  }

  code {
    color: #f66;
  }
}  

#note {
  display: flex;
  align-items: stretch;
  background-color: #fff;
  flex: 1;
}

</style>