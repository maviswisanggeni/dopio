<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-xs">Pengguna</span>
      <q-btn round dense flat size="12px" icon="cached" @click="getUsers()"></q-btn>
    </portal>

    <div class="row q-pt-md q-col-gutter-md">
      <div v-for="user in users" :key="user.id">
        <q-card class="user-card cursor-pointer" @click="openEditDialog(user)">
          <div class="user-label">{{ user.name }}</div>
          <div class="role-label">{{ user.role.name }}</div>
          <div style="height: 16px;"></div>
          <div class="email-label">{{ user.email }}</div>
          <div class="phone-label">{{ user.phone | phoneNumber }}</div>
        </q-card>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[8, 16]">
      <q-btn round size="11px" padding="10px" icon="add" color="primary" @click="openCreateDialog" />
    </q-page-sticky>

    <create-user-dialog v-model="isCreateDialogOpen" />
    <edit-user-dialog v-model="isEditDialogOpen" :userSelected="user" />
  </q-page>
</template>

<script>
import EditUserDialog from './EditUserDialog';
import CreateUserDialog from './CreateUserDialog';
import { mapState } from 'vuex';

export default {
  name: 'UserPage',
  components: { CreateUserDialog, EditUserDialog },
  data() {
    return {
      isCreateDialogOpen: false,
      isEditDialogOpen: false,
      pagination: { page: 1, rowsPerPage: 10, rowsNumber: 10 },
      user: {},
    };
  },
  computed: {
    ...mapState('user', {
      users: state => state.users,
      isLoading: state => state.isLoading,
    }),
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      await this.$store.dispatch('role/get', this);
      await this.$store.dispatch('user/get', this);
    },
    openCreateDialog() {
      this.isCreateDialogOpen = true;
    },
    async openEditDialog(user) {
      this.user = user;
      this.user = await this.$store.dispatch('user/show', this);
      this.isEditDialogOpen = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.user-card {
  width: 250px;
  padding: 12px;
  border-radius: 8px;
}

.user-label {
  font-size: 20px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.25px;
  margin-bottom: -4px;
}

.role-label {
  color: #0064fa !important;
  font-family: Proxima-Nova-Alt;
  font-size: 14px;
  font-weight: 600;
}

.email-label {
  font-size: 12px;
  height: 10px;
  color: $grey-8;
  margin-top: -4px;
  margin-bottom: 8px;
}

.phone-label {
  font-size: 12px;
  height: 10px;
  font-weight: bold;
  margin-bottom: 4px;
}
</style>
