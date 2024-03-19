<template>
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">
        <ul class="infinite-list" style="overflow: auto">
          <li v-for="(module, index) in data.moduleList"
              :key="index"
              class="infinite-list-item">
            <el-card :body-style="{ padding: '0px' }">
              <!--              <img-->
              <!--                  src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"-->
              <!--                  class="image"-->
              <!--              />-->
              <div style="padding: 14px">
                <div class="bottom">
                  <div class="time" @click="clickModule(module)">{{ module.name }}</div>
                </div>
              </div>
            </el-card>
          </li>
        </ul>
      </el-aside>
      <el-main>
        <el-row>
          <el-col
              v-for="(template, index) in data.templateList"
              :key="index"
              :span="8"
          >
            <el-card :body-style="{ padding: '0px' }">
              <!--              <img-->
              <!--                  src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"-->
              <!--                  class="image"-->
              <!--              />-->
              <div style="padding: 14px">
                <div class="bottom">
                  <div class="time" @click="click(template)">{{ template.name }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-card :body-style="{ padding: '0px' }">
          <!--              <img-->
          <!--                  src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"-->
          <!--                  class="image"-->
          <!--              />-->
          <div style="padding: 14px">
            <div class="bottom">
              <div class="time" @click="add()">添加</div>
            </div>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">

import {onMounted, reactive} from "vue";
import {moduleCreate, modulePage} from "@/api/module";
import {Module, PageParam, Template} from "@/types/R";
import {useRouter} from "vue-router";
import {templatePage} from "@/api/template";

const data = reactive({
  moduleList: [] as Array<Module>,
  templateList: [] as Array<Template>,
})
const router = useRouter()
onMounted(() => {
  modulePage(<PageParam & Module>{
    current: 1,
    size: 50,
    name: "123"
  })
      .then(res => {
        console.log(res)
        data.moduleList = res.data.records
      })
  
  // moduleCreate(<Module>{})
  //     .then(res => {
  //       console.log(res)
  //       data.list = res.data
  //     })
})

function add(){

}

function clickModule(module: Module) {
  
  templatePage(<Template & PageParam>{
    current: 1,
    size: 50,
    moduleId: module.id
  })
      .then(res => {
        data.templateList = res.data.records
      })
      .catch(e => {
        console.log(e)
      })
}

function click(module: Module) {
  
  router.push({
    path: '/design',
    query: {
      moduleId: module.id,
      templateId: module.id
    },
  })
}

</script>

<style scoped>
.infinite-list {
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}

.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>
