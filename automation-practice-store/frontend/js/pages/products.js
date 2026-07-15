const DEFAULT_FILTERS = {
  search: '',
  category: 'all',
  sort: 'name',
  minPrice: 0,
  maxPrice: 250,
  inStockOnly: false,
  viewMode: 'grid',
};

const ProductsPage = {
  renderGeneration: 0,
  state: {
    products: [],
    categories: [],
    page: 1,
    pageSize: 6,
    filters: { ...DEFAULT_FILTERS },
  },

  async render() {
    if (!requireAuth()) {
      Router.navigate('/login');
      return;
    }

    const generation = ++this.renderGeneration;
    this.state.page = 1;
    this.state.filters = { ...DEFAULT_FILTERS };

    setBreadcrumb([
      { label: 'Home', href: '#/products' },
      { label: 'Products', href: '#/products' },
    ]);

    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div data-testid="products-page">
        <h1 class="page-title" data-testid="products-title">Products</h1>
        <p class="page-subtitle">Browse catalog — filters exercise dropdowns, radios, checkboxes, range &amp; search</p>

        <div class="card">
          <div class="filters-bar" data-testid="filters-bar">
            <div class="form-group">
              <label for="search">Search</label>
              <input type="text" id="search" data-testid="search-input" placeholder="Search products...">
            </div>
            <div class="form-group">
              <label for="category">Category</label>
              <select id="category" data-testid="category-dropdown">
                <option value="all">All Categories</option>
              </select>
            </div>
            <div class="form-group">
              <label for="sort">Sort By</label>
              <select id="sort" data-testid="sort-dropdown">
                <option value="name">Name (A-Z)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
            <div class="form-group">
              <label for="max-price">Max Price: $<span id="max-price-label">250</span></label>
              <input type="range" id="max-price" data-testid="price-range-slider" min="10" max="250" value="250">
            </div>
          </div>

          <div class="grid-2" style="margin-bottom:1rem">
            <fieldset class="form-group" data-testid="view-mode-radio-group">
              <legend>View Mode</legend>
              <div class="radio-group">
                <label><input type="radio" name="viewMode" value="grid" data-testid="view-grid-radio" checked> Grid</label>
                <label><input type="radio" name="viewMode" value="list" data-testid="view-list-radio"> List</label>
              </div>
            </fieldset>
            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" id="in-stock" data-testid="in-stock-checkbox">
                In stock only
              </label>
            </div>
          </div>

          <div id="products-container" data-testid="products-container"></div>
          <div id="pagination" class="pagination" data-testid="pagination"></div>
        </div>
      </div>
    `;

    await this.loadCategories(generation);
    if (generation !== this.renderGeneration) return;
    this.bindEvents();
    await this.loadProducts(generation);
  },

  async loadCategories(generation) {
    const res = await API.products.categories();
    if (generation !== this.renderGeneration) return;
    this.state.categories = res.data;
    const select = document.getElementById('category');
    if (!select) return;
    res.data.forEach((cat) => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      select.appendChild(opt);
    });
  },

  bindEvents() {
    document.getElementById('search').addEventListener('input', (e) => {
      this.state.filters.search = e.target.value;
      this.state.page = 1;
      this.loadProducts();
    });

    document.getElementById('category').addEventListener('change', (e) => {
      this.state.filters.category = e.target.value;
      this.state.page = 1;
      this.loadProducts();
    });

    document.getElementById('sort').addEventListener('change', (e) => {
      this.state.filters.sort = e.target.value;
      this.loadProducts();
    });

    document.getElementById('max-price').addEventListener('input', (e) => {
      this.state.filters.maxPrice = Number(e.target.value);
      document.getElementById('max-price-label').textContent = e.target.value;
      this.state.page = 1;
      this.loadProducts();
    });

    document.getElementById('in-stock').addEventListener('change', (e) => {
      this.state.filters.inStockOnly = e.target.checked;
      this.state.page = 1;
      this.loadProducts();
    });

    document.querySelectorAll('input[name="viewMode"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        this.state.filters.viewMode = e.target.value;
        this.renderProducts();
      });
    });
  },

  async loadProducts(generation = this.renderGeneration) {
    const { search, category, sort, maxPrice } = this.state.filters;
    const params = {
      category,
      sort,
      maxPrice,
    };

    if (search) {
      params.search = search;
    }

    const res = await API.products.list(params);
    if (generation !== this.renderGeneration) return;
    let products = res.data;

    if (this.state.filters.inStockOnly) {
      products = products.filter((p) => Number(p.stock) > 0);
    }

    this.state.products = products;
    this.renderProducts();
    this.renderPagination();
  },

  renderProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    const start = (this.state.page - 1) * this.state.pageSize;
    const pageProducts = this.state.products.slice(start, start + this.state.pageSize);

    if (pageProducts.length === 0) {
      container.innerHTML = `<div class="alert alert-info" data-testid="no-products-alert">No products found.</div>`;
      return;
    }

    const isList = this.state.filters.viewMode === 'list';
    container.className = isList ? '' : 'product-grid';

    container.innerHTML = pageProducts
      .map(
        (p) => `
        <article class="${isList ? 'card' : 'product-card'}" data-testid="product-card-${p.id}">
          <div class="product-image" data-testid="product-image-${p.id}">${p.image}</div>
          <h3 class="product-name" data-testid="product-name-${p.id}">${p.name}</h3>
          <p class="product-desc">${p.description}</p>
          <p class="product-price" data-testid="product-price-${p.id}">${formatCurrency(p.price)}</p>
          <div class="product-actions">
            <button type="button" class="btn btn-secondary" data-testid="view-details-${p.id}"
              onclick="ProductsPage.showDetails('${p.id}')">Details</button>
            <button type="button" class="btn btn-primary" data-testid="add-to-cart-${p.id}"
              onclick="ProductsPage.addToCart('${p.id}')">Add to Cart</button>
          </div>
        </article>
      `
      )
      .join('');
  },

  renderPagination() {
    const totalPages = Math.ceil(this.state.products.length / this.state.pageSize) || 1;
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    pagination.innerHTML = Array.from({ length: totalPages }, (_, i) => i + 1)
      .map(
        (n) =>
          `<button type="button" data-testid="page-${n}" class="${n === this.state.page ? 'active' : ''}"
            onclick="ProductsPage.goToPage(${n})">${n}</button>`
      )
      .join('');
  },

  goToPage(page) {
    this.state.page = page;
    this.renderProducts();
    this.renderPagination();
  },

  async showDetails(productId) {
    const res = await API.products.get(productId);
    const p = res.data;
    openModal(`
      <h2 data-testid="modal-product-name">${p.name}</h2>
      <p style="font-size:3rem;text-align:center">${p.image}</p>
      <p data-testid="modal-product-desc">${p.description}</p>
      <p><strong>Category:</strong> ${p.category}</p>
      <p><strong>Stock:</strong> ${p.stock}</p>
      <p><strong>Price:</strong> ${formatCurrency(p.price)}</p>
      <button type="button" class="btn btn-primary" data-testid="modal-add-to-cart"
        onclick="ProductsPage.addToCart('${p.id}'); closeModal();">Add to Cart</button>
    `);
  },

  async addToCart(productId) {
    try {
      await API.cart.addItem(productId, 1);
      showToast('Added to cart', 'success');
      await refreshCartBadge();
    } catch (err) {
      showToast(err.message, 'error');
    }
  },
};

async function renderProductsPage() {
  await ProductsPage.render();
}
