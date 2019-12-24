<template>
  <div class="results">
      <el-card style="margin-top: 20px; margin-bottom: 20px" shadow="always">
        <el-row>
            <el-col :span="7" v-for="(item, index) in data" style="margin-left: 30px; margin-top: 30px">
                <el-card shadow="hover" v-loading="loadingImage">
                <img :src="item.img" class="image">
                <div style="padding: 14px;">
                    <h4>{{item.url}}</h4>
                    <div class="bottom clearfix">
                        <el-button type="text" class="button" @click="OpenDialog(item)">Chi tiết ảnh</el-button>
                    </div>
                </div>
                </el-card>
            </el-col>
        </el-row>
    </el-card>
    <el-dialog title="Chi tiết ảnh"  width="60%" :visible.sync="dialogInfo">
        <div v-loading="loadingDialog">
            <img :src="this.image.img" style="width: 100%">
        </div>
    </el-dialog>
  </div>
</template>
<script>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import axios from 'axios';

export default {  
  data() {
    return {
        dialogInfo: false,
        loadingDialog: true,
        loadingImage: false,
        data: [],
        errors: [],
        image: {},
    };
  },

  beforeMount(){
      this.getData()
  },

  methods: {
    async getData(){
        this.loadingImage = false
        await axios.post('http://maimeo3.herokuapp.com/getdata')
            .then(response => {
                this.data = response.data
                })
            .catch(e => {
            this.errors.push(e)
            })

            this.loadingImage = true
    },
    OpenDialog(item){
        this.loadingDialog = true
        this.image = item
        this.loadingDialog = false
        this.dialogInfo = true

    }
  },
}
</script>

<style>  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 250px;
    height: 250px;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>