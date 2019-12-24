<template>
  <div class="results">
        <el-card >
        <el-row>
            <el-col :span="1">
                <el-button style="margin-left: 40px" type="primary">
                    <i class="el-icon-back"></i>
                    Quay lại
                </el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="7" v-for="(item, index) in data" style="margin-left: 40px; margin-top: 30px">
                <el-card shadow="hover" class="card-image">
                <img :src="item.img" class="image" @click="OpenDialog(item)">
                <div style="padding: 14px;">
                    <a target="_blank" :href="item.url">Đường dẫn</a>
                </div>
                </el-card>
            </el-col>
        </el-row>
    </el-card>
    <el-dialog title="Chi tiết ảnh"  width="45%" :visible.sync="dialogInfo">
        <div v-loading="loadingDialog">
            <img :src="this.image.img" style="width: 75%">
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
        data: [],
        errors: [],
        image: {},
    };
  },

  computed: {
      ...mapGetters([
          'data',
      ])
  },

  methods: {
    
    OpenDialog(item){
        this.loadingDialog = true
        this.image = item
        this.loadingDialog = false
        this.dialogInfo = true

    }
  },
}
</script>

<style scoped>  
    .card {
        margin-top: 20px; 
        margin-bottom: 20px;
        margin-left: 20px;
        margin-right: 20px;
        background-color: #373842;
        border: 1px solid rgba(0,0,0,.8);
    }

    a:hover{
        color: blue;
        text-decoration: none;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        height: 350px;
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