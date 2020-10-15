// с Vue, классы больше не нужны
// import { Basket, Catalog } from "./LISTS";

// export default () => {
//   let basket = new Basket();
//   let catalog = new Catalog(basket);
// };

export default () => {
  const app = new Vue({
    el: "#app",
    data: {
      filter: "",
      filteredCatalogItems: [],
      catalogItems: [],
      catalogUrl:
        "https://raw.githubusercontent.com/kellolo/static/master/JSON/catalog.json",
      basketUrl:
        "https://raw.githubusercontent.com/kellolo/static/master/JSON/basket.json",
      show: true,
      basketItems: [],
    },
    methods: {
      //методы компонента
      get(url) {
        return fetch(url).then((d) => d.json());
      },
      filterCatalog() {
        this.filteredCatalogItems = this.catalogItems.filter((el) =>
          el.productName.match(new RegExp(this.filter, "i"))
        );
      },
      buy(item) {
        // находим среди basketItems элементы с productName == item.productId
        let find = this.basketItems.find(
          (el) => el.productName == item.productId
        );
        // если нашли то к кол-ву +1
        if (find) {
          find.amount++;
        }
        // иначе basketItems "от себя"(назначить ({пустой объект}, пункт, кло-во:1))
        else {
          this.basketItems.push(Object.assign({}, item, { amount: 1 }));
        }
      },
      // удаление. пробросим id, ищем в корзине и сравниваем с проброшеным id
      remove(id) {
        let find = this.basketItems.find((el) => el.productName == id);
        // знаем что будет найдено. поэтому узнаем кол-во и минус 1
        if (find.amount > 1) {
          find.amount--;
        } else {
          // иначе (удаляем его из корзины) basketItems 'сращиваем ' (basketItems.indexOf)
          this.basketItems.splice(this.basketItems.indexOf(find), 1);
        }
      },
    },
    watch: {
      // вотчеры // функции следящие за изменением внутрикомпонентных реактивных данных.при изменнении каких то данных, можем както реагировать
      filter() {
        this.filteredCatalogItems = this.catalogItems.filter((el) =>
          el.productName.match(new RegExp(this.filter, "i"))
        );
      },
    },
    // ХУКИ - события жизненного цикла компонента
    mounted() {
      this.get(this.catalogUrl).then((items) => {
        this.catalogItems = items;
        this.filteredCatalogItems = items;
      });

      this.get(this.basketUrl).then((basket) => {
        this.basketItems = basket.content;
      });
    },
    computed: {
      total() {
        //   let sum = this.basketItems.reduce(
        //     (sum, item) => sum + item.productPrice * item.amount
        //   );
        //   return sum ? sum : 1500;
      },
    },
  });
};
