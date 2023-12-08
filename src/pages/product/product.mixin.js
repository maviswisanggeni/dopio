import { isEmpty } from 'lodash';
import { getRangePrice } from 'src/helpers/app.helper';

export default {
  data() {
    return {
      panel: 'product',
      product: { variants: [] },
      categories: [],
      extras: [],

      allProductVariant: [],
      productVariants: [],
      selectedProductVariant: {},
      isSetStock: false,

      allIngredients: [],
      ingredients: [],
      selectedRecipeDetail: {},
      isSetRecipe: false,
    };
  },

  computed: {
    productsFiltered() {
      const filter = this.filter.toLowerCase();
      return this.products.filter(product => product.name.toLowerCase().includes(filter));
    },
  },

  created() {
    this.categories = [...this.$store.state.category.categories];
    this.categories.unshift({ id: null, name: '' });
    this.allProductVariant = this.$store.state.product.productVariants;
    this.allIngredients = this.$store.state.ingredient.ingredients;
  },

  methods: {
    // UI
    onHasStockChanged(val) {
      if (val == false) return;
      this.product.variants[0].stock = 0;
      this.product.variants[0].alertIn = 0;
      this.product.variants[0].isAlert = false;
    },
    onHasRecipeChanged(val) {
      if (val == true) return;
    },
    setProduct() {
      this.panel = 'product';
      this.isSetStock = false;
      this.isSetRecipe = false;
      this.hasIngredient = false;
      this.product = { name: null, hasStock: false, hasRecipe: false, variants: [] };
      this.product.variants.push({ name: null, price: 0, recipeDetails: [] });
      this.extras = this.$store.state.extra.extras.map(extra => {
        return { ...extra, isSelected: false };
      });
    },

    // Product Variant
    setProductVariants(props = {}) {
      const exceptIds = this.product.variants.map(ei => ei.productId);
      if (exceptIds.length == 0) {
        this.productVariants = this.allProductVariant;
        return;
      }
      if (props.includeId) {
        const index = exceptIds.indexOf(props.includeId);
        exceptIds.splice(index, 1);
      }
      this.productVariants = this.allProductVariant.filter(ingredient => !exceptIds.includes(ingredient.id));
    },
    addProductVariant() {
      this.setProductVariants();
      this.selectedProductVariant = { index: this.product.variants.length, recipeDetails: [] };
      this.panel = 'add-product';
    },
    editProductVariant(productVariant) {
      productVariant.index = this.product.variants.findIndex(pv => pv == productVariant);
      this.setProductVariants({ includeId: productVariant.productId });
      this.selectedProductVariant = productVariant;
      this.panel = 'add-product';
    },
    backFromProductVariant() {
      this.selectedProductVariant = {};
      this.panel = 'product';
    },
    saveProductVariant(productVariant) {
      if (this.product.variants[0].name == null) this.product.variants[0].name = 'Normal';
      const index = productVariant.index;
      this.product.variants[index] = productVariant;
      this.product.rangePrice = getRangePrice(this.product);
    },
    destroyProductVariant() {
      const index = this.product.variants.findIndex(variant => variant.id == this.selectedProductVariant.id);
      this.product.variants.splice(index, 1);
    },

    // Recipe
    selectRecipeDetail(payload) {
      let { productVariant, recipeDetail } = payload;
      this.selectedProductVariant = productVariant;
      if (!recipeDetail) recipeDetail = {};
      if (isEmpty(this.selectedProductVariant)) this.selectedProductVariant = this.product.variants[0];
      this.setIngredients({ includeId: recipeDetail.ingredientId });
      this.selectedRecipeDetail = recipeDetail;
      const index = this.selectedProductVariant.recipeDetails.findIndex(rd => rd == recipeDetail);
      if (index < 0) {
        this.selectedRecipeDetail.index = this.selectedProductVariant.recipeDetails.length;
        this.selectedRecipeDetail.qty = 1;
      } else {
        this.selectedRecipeDetail.index = index;
      }
      this.panel = 'add-recipe-detail';
    },
    setIngredients(props = {}) {
      const exceptIds = this.selectedProductVariant.recipeDetails.map(recipeDetail => recipeDetail.ingredientId);
      if (exceptIds.length == 0) {
        this.ingredients = this.allIngredients;
        return;
      }
      if (props.includeId) {
        const index = exceptIds.indexOf(props.includeId);
        exceptIds.splice(index, 1);
      }
      this.ingredients = this.allIngredients.filter(ingredient => !exceptIds.includes(ingredient.id));
    },
    backFromIngredient() {
      this.selectedRecipeDetail = {};
      if (this.product.variants[0] == this.selectedProductVariant) {
        this.panel = 'product';
        this.selectedProductVariant = {};
        return;
      }
      this.panel = 'add-product';
    },
    saveIngredient(recipeDetail) {
      // const index = this.selectedProductVariant.recipeDetails.findIndex(ei => ei.id == recipeDetail.id);
      // if (index < 0) return this.selectedProductVariant.recipeDetails.push(recipeDetail);
      const index = recipeDetail.index;
      this.selectedProductVariant.recipeDetails[index] = recipeDetail;
    },
    destroyIngredient() {
      const index = this.selectedProductVariant.recipeDetails.findIndex(ei => ei.ingredientId == this.selectedRecipeDetail.ingredientId);
      this.selectedProductVariant.recipeDetails.splice(index, 1);
    },
  },
};
