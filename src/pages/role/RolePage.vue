<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-xs">Posisi & Hak Akses</span>
      <q-btn round dense size="12px" flat icon="cached" @click="getRoles()"></q-btn>
    </portal>

    <div class="row q-pt-md q-col-gutter-md">
      <div v-for="role in roles" :key="role.id">
        <q-card class="role-card cursor-pointer" @click="openEditDialog(role)">
          <div class="role-label">{{ role.name }}</div>
          <div class="row q-col-gutter-x-md q-col-gutter-y-xs">
            <div class="col-6" v-for="permission in permissions" :key="permission.value">
              <div :class="{ 'no-access': !isCanAccessRole(role.permissions, permission) }">
                <q-icon class="access-icon" name="stop_circle" size="10px" style="padding-bottom: 1px;" />
                <span class="permission-label">{{ permission.label }}</span>
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[8, 16]">
      <q-btn round size="11px" padding="10px" icon="add" color="primary" @click="openCreateDialog" />
    </q-page-sticky>

    <create-role-dialog v-model="isCreateDialogOpen" />
    <edit-role-dialog v-model="isEditDialogOpen" :roleSelected="role" />
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import CreateRoleDialog from './CreateRoleDialog';
import EditRoleDialog from './EditRoleDialog';

export default {
  name: 'RolePage',
  components: { CreateRoleDialog, EditRoleDialog },
  data() {
    return {
      pagination: { page: 1, rowsPerPage: 10, rowsNumber: 10 },
      isCreateDialogOpen: false,
      isEditDialogOpen: false,
      role: {},
    };
  },

  computed: {
    ...mapState('role', {
      roles: state => state.roles,
      isLoading: state => state.isLoading,
      permissions: state => state.permissions,
    }),
  },

  mounted() {
    this.getRoles();
  },
  methods: {
    isCanAccessRole(rolePermissions, permission) {
      return rolePermissions.find(role => role == permission.value) ? true : false;
    },
    async getRoles() {
      await this.$store.dispatch('role/get', this);
    },
    openCreateDialog() {
      this.isCreateDialogOpen = true;
    },
    async openEditDialog(role) {
      this.role = role;
      this.role = await this.$store.dispatch('role/show', this);
      this.isEditDialogOpen = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.role-card {
  width: 250px;
  height: 105px;
  padding: 12px;
  border-radius: 8px;
}

.role-label {
  font-family: Proxima-Nova-Alt;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

.permission-label {
  font-size: 13px;
  margin-left: 4px;
}

.access-icon {
  color: $positive;
}

.no-access {
  color: $grey-5 !important;

  .access-icon {
    color: $grey-5;
  }
}
</style>
