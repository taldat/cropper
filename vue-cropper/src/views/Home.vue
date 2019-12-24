<template>
  <div class="home-container">
    <input
      ref="input"
      type="file"
      name="image"
      accept="image/*"
      class="input-img"
      @change="setImage"
    />
    <div class="input-container" v-if="imgSrc == ''">
      <i class="el-icon-picture-outline"></i><br>
      <el-button class="input-btn" type="primary" @click="showFileChooser">
        Chọn ảnh
      </el-button>
    </div>

    <div class="content" v-else>
      <section class="cropper-area">
      <el-col :span="5" class="action">
          <div class="item">
            <div class="label">
              Loại quần áo
            </div>
            <div class="btn">
              <el-select v-model="type" placeholder="Chọn loại quần áo" class="select-type">
                <el-option
                  v-for="item in imgType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="item">
            <div class="label">
              Xoay ảnh
            </div>
            <div class="btn">
              <el-button @click.prevent="rotate(90)" type="primary">
                Xoay phải
                <i class="el-icon-refresh-right"></i>
              </el-button>
              <el-button @click.prevent="rotate(-90)" type="primary">
                Xoay trái
                <i class="el-icon-refresh-left"></i>
              </el-button>
            </div>
          </div>
          <div class="item">
            <div class="label">
              Lật ảnh
            </div>
            <div class="btn">
              <el-button class="btn-a" @click.prevent="flipX" type="primary">
                <a ref="flipX" href="#" role="button">
                  Lật ngang
                  <i class="el-icon-refresh"></i>
                </a>
              </el-button>
              <el-button class="btn-a" @click.prevent="flipY" type="primary">
                <a ref="flipY" href="#" role="button">
                  Lật dọc
                  <i class="el-icon-sort"></i>
                </a>
              </el-button>
            </div>
          </div>
          <div class="item">
            <div class="label">
              Cắt ảnh
            </div>
            <div class="btn">
              <el-button @click.prevent="reset" type="danger">
                <i class="el-icon-close"></i>
              </el-button>
              <el-button @click.prevent="cropImage" type="success">
                <i class="el-icon-check"></i>
              </el-button>
            </div>
          </div>
          <div class="item">
            <div class="label">
              Chọn ảnh khác
            </div>
            <div class="btn">
              <el-button @click.prevent="showFileChooser" type="primary">
                Chọn ảnh
              </el-button>
            </div>
          </div>
      </el-col>
      <el-col :span="19" class="cropper-area">
        <div class="img-cropper">
          <vue-cropper
            ref="cropper"
            :src="imgSrc"
          />
        </div>
      </el-col>
      </section>
      <el-dialog
        class="dialog-img"
        title="Ảnh đã cắt"
        :visible.sync="dialog">
        <span>
          <div class="cropped-image">
            <img
              v-if="cropImg"
              :src="cropImg"
              alt="Cropped Image"
            />
            <div v-else class="crop-placeholder" />
          </div>
      </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog = false">Quay lại</el-button>
          <el-button type="primary" @click="uploadImage">Đồng ý</el-button>
        </span>
      </el-dialog> 
    </div>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import Message from 'element-ui';
import axios from 'axios'
export default {
  components: {
    VueCropper,
  },
  data() {
    return {
      dialog: false,
      imgSrc: '',
      img: '',
      crop: '',
      cropImg: '',
      type: '',
      imgType: [
        {
          label: 'Áo',
          value: '1'
        },
        {
          label: 'Quần',
          value: '2'
        },
        {
          label: 'Váy',
          value: '3'
        },
        {
          label: 'Giày',
          value: '4'
        },
        {
          label: 'Đồng hồ',
          value: '5'
        },
      ]
    };
  },

  methods: {
    cropImage() {
      this.dialog = true
      this.crop = this.$refs.cropper.getCroppedCanvas()
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL()
    },
    flipX() {
      const dom = this.$refs.flipX;
      let scale = dom.getAttribute('data-scale');
      scale = scale ? -scale : -1;
      this.$refs.cropper.scaleX(scale);
      dom.setAttribute('data-scale', scale);
    },
    flipY() {
      const dom = this.$refs.flipY;
      let scale = dom.getAttribute('data-scale');
      scale = scale ? -scale : -1;
      this.$refs.cropper.scaleY(scale);
      dom.setAttribute('data-scale', scale);
    },
    reset() {
      this.$refs.cropper.reset();
    },
    rotate(deg) {
      this.$refs.cropper.rotate(deg);
    },
    setImage(e) {
      const file = e.target.files[0];
      if (file.type.indexOf('image/') === -1) {
        this.$message({
          type: 'error',
          message: 'Không đúng định dạng file'
        })
        return;
      }
      this.img = file
      console.log(this.img)
      if (typeof FileReader === 'function') {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imgSrc = event.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.$message({
          type: 'error',
          message: 'File không được hỗ trợ'
        })
        return;
      }
    },
    showFileChooser() {
      this.$refs.input.click();
    },
    uploadImage() {
      if (this.type == '') {
        this.$message({
          type: 'error',
          message: 'Bạn chưa chọn loại quần áo'
        })
      } else {
        this.crop.toBlob((blob) => {
          let form = new FormData()
          form.append('file', blob, this.img.name)
          axios.post('http://192.168.43.192:3000/getdata?type=' + this.type, form)
          .then(res => {
            this.$store.dispatch('saveData', res.data)
          }).catch(err => console.log(err))
        })
      }
    }
  },
};
</script>

<style lang="css" scoped>
.input-img {
  display: none;
}

.home-container {
  min-height: calc(100vh - 56px);
  width: 100%;
}

.input-container {
  width: 100%;
  text-align: center;
  padding-top: 10%;
}

.input-container i {
  color: white;
  font-size: 120px;
  margin-bottom: 20px;
}

.input-container .el-button {
  color: white;
  font-size: 30px;
}

.action {
  text-align: justify;
  background-color: #373842;
  color: white;
  border: none;
  min-height: calc(100vh - 56px);
}

.item {
  background-color: #25262d;
  margin: 10px;
  padding: 20px; 
  border-radius: 12px;
}

.item .label {
  color: white;
  font-size: 20px;
  padding-bottom: 5px;
  border-bottom: 1px solid #3f414c;
}

.item .btn {
  padding-top: 10px;
}

.item .btn .el-button {
  width: 45%;
  padding: 10px 0;
  font-size: 16px;
}

.item .btn .el-button a {
  color: white;
  text-decoration: unset;
}

.cropper-area {
  display: flex;
  align-items: center;
}

.img-cropper {
  width: 60%;
  margin-left: 20%;
}
</style>