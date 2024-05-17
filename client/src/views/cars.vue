<script setup>
import { ref, onMounted, getCurrentInstance, unref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
let router = useRouter()
let instance = getCurrentInstance()

onMounted(() => {
  getData()
})

let data = ref([])
let modalData = ref({})

async function getData() {
  data = await axios.get(`http://localhost:3000/api/cars_park`).then((res) => {
    return res.data
  })
  data.forEach(element => {
    axios.get(`http://localhost:3000/api/drivers_info?_where=(car_id,eq,${element.id})`).then((res) => {
        element.driver = res.data[0]['fullname']
    instance?.proxy?.$forceUpdate()
  })
  });
  instance?.proxy?.$forceUpdate()
}

async function deleteRow(id) {
  await axios.delete(`http://localhost:3000/api/stock/${id}`).then((res) => {
  })
  getData()
}

function openNew() {
  this.modalData = {}
  this.modalData.title = 'Добавить авто'
  
  $('#editModal').modal('show')
}

async function edit(id) {
  this.modalData = {}

  let edit = await axios.get(`http://localhost:3000/api/stock_content?_where=(stock_id,eq,${id})`).then((res) => {
    return res.data
  })
  let stock_data = await axios.get(`http://localhost:3000/api/stock/${id}`).then((res) => {
    return res.data
  })
  this.modalData = stock_data[0]
  this.modalData.content = edit
  this.modalData.title = 'Изменить перевозку'
  $('#editModal').modal('show')
}
function deleteContent(id) {
  this.modalData.content.splice(id, 1)
}

async function saveForm() {
  await axios.post("http://localhost:3000/api/stock", {
    destination: unref(unref(modalData).destination)
  })
  let last = await axios.get("http://localhost:3000/api/stock?_sort=-id").then((res) => {
    return res.data[0]
  })
  unref(modalData).content.forEach(element => {
    axios.post("http://localhost:3000/api/stock_content", {
      stock_id:last['id'],
      title:element.title
    })
  });
  $('#editModal').modal('hide')
  getData()
}
</script>

<template>
  <navbar></navbar>
  <main class="pt-2 px-3">
    <button class="btn btn-primary" @click="openNew()">Зарегистрировать авто</button>
    <br />
    <br />
    <table class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Название</th>
          <th>Год выпуска</th>
          <th>Vin</th>
          <th>Водитель</th>
          <th style="width: 0" class="pe-5"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id">
          <td scope="col">{{ item.id }}</td>
          <td scope="col">{{ item.title }}</td>
          <td scope="col">{{ item.year }}</td>
          <td scope="col">{{ item.vin }}</td>
          <td scope="col">{{ item.driver }}</td>
          <td class="d-flex flex-row gap-2 justify-content-center align-items-center">
            <button class="btn-close" @click="deleteRow(item.id)"></button>
            <button class="btn btn-primary" @click="edit(item.id)">Просмотр</button>
          </td>
        </tr>
      </tbody>
    </table>
  </main>

  <div class="modal fade" id="editModal" tabindex="-1" role="dialog" v-show="modalData.title">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ modalData.title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3" v-if="modalData.id">
              <label class="form-label">Номер груза</label>
              <input type="text" class="form-control" disabled :value="modalData.id"/>
            </div>
            <div class="mb-3">
              <label class="form-label">Место назначения</label>
              <input type="text" class="form-control" :disabled="modalData.id" v-model="modalData.destination" />
            </div>
            <div class="mb-3">
              <label class="form-label">Дата прибытия</label>
              <input type="text" class="form-control" disabled :value="modalData.arrival_date" />
            </div>
            <div class="mb-3">
              <h5>Состав</h5>
              <ul class="list-group gap-1">
                <li
                  class="list-group-item border-0"
                  v-if="!modalData.content || modalData.content.length == 0"
                >
                  Пусто
                </li>
                <div
                  class="list-group-item d-flex justify-content-between align-items-center gap-2"
                  v-for="(item, index) in modalData.content"
                >
                  <li class="list-group-item p-0 d-flex flex-row w-100 flex-shrink-1">
                    <input
                    :disabled="modalData.id"
                    class="w-100 h-100 form-control"
                   v-model:="item.title"
                  >
                  </input>
                  </li>
                  <button
                    type="button"
                    v-if="!modalData.id"
                    class="btn btn-close"
                    @click="deleteContent(index)"
                  ></button>
                </div>
              </ul>
              <br />
              <button
              v-if="!modalData.id"
                type="button"
                class="btn btn-primary"
                @click="modalData.content.push({ title: 'Груз' })"
              >
                Добавить
              </button>
            </div>
          </form>
        </div>
        <div class="modal-footer" v-if="!modalData.id">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
          <button type="button" class="btn btn-primary" @click="saveForm">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>
