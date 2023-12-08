<template>
  <div class="menu-list">
    <q-expansion-item v-if="children" group="somegroup" expand-icon-class="text-grey-alt" dense-toggle>
      <template v-slot:header>
        <q-item-section class="q-pr-none" style="min-width:36px" avatar>
          <q-icon size="xs" :name="icon" />
        </q-item-section>
        <q-item-section class="label">
          {{ title }}
        </q-item-section>
      </template>
      <q-list class="children-list">
        <q-item class="children-item" dense v-for="(item, index) in children" :key="index" clickable :to="item.to">
          <q-item-section>
            <q-item-label class="label">{{ item.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>

    <q-item v-else clickable :to="to" exact>
      <q-item-section class="q-pr-none" style="min-width:36px" avatar>
        <q-icon size="xs" :name="icon" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="label">{{ title }}</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
export default {
  name: 'ButtonLink',
  props: {
    title: { type: String, required: true },
    to: { type: String, default: '#' },
    icon: { type: String },
    children: { type: Array }
  }
};
</script>

<style lang="scss" scoped>
.menu-list {
  font-family: 'Proxima-Nova-Alt';
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);

  &:hover {
    color: white;
  }
}

.children-list {
  color: $grey_alt;
  background: $dark_alt;
}

.children-item {
  padding-left: 52px;
  &:hover {
    color: white;
  }
}

.q-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.07);
}

.q-item.q-router-link--active,
.q-item--active {
  color: white;
  font-weight: 300;
  background: rgba(255, 255, 255, 0.07);

  &:hover {
    background: rgba(255, 255, 255, 0.07);
  }
}
</style>
