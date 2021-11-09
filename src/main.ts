import {
  createApp,
  defineComponent,
  Plugin,
  h,
  ref,
  inject,
  resolveComponent,
  resolveDirective,
  withDirectives,
} from "vue"

const dogePlugin: Plugin = {
  install(app, options) {
    // output options
    console.log({ options })
    console.log("install plugin wow")

    // Provide
    app.provide("doge", "inject wow")

    app.directive("doge", {
      mounted(el, binding, vnode) {
        console.log({ el, binding, vnode })
        el.style["width"] = "200px"
        el.style["height"] = "200px"
        el.style["background-image"] =
          "url('https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/Original_Doge_meme.jpg/300px-Original_Doge_meme.jpg')"
      },
    })
  },
}

const useDoge = (power: number) => {
  const dogePower = ref(power)
  const wow = inject<string>("doge") ?? ""

  const barking = () => {
    console.log(wow + dogePower.value)
    dogePower.value++
  }

  return {
    barking,
  }
}

const DogeComponent = defineComponent({
  props: {
    power: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const { barking } = useDoge(props.power)

    const barkingButtonEl = h(
      "button",
      {
        onClick: barking,
      },
      "barking!"
    )

    const dogeDirective = resolveDirective("doge") as any

    return () => {
      return withDirectives(h("div", [barkingButtonEl]), [
        [dogeDirective, "doge"],
      ])
    }
  },
})

const App = defineComponent({
  components: {
    DogeComponent,
  },
  setup() {
    const count = ref(100)

    return () => {
      const buttonEl = h(
        "button",
        {
          onClick: () => {
            count.value++
          },
        },
        "click me" + count.value
      )

      const dogeComponent = resolveComponent("doge-component")

      return h("div", [
        buttonEl,
        h(dogeComponent, {
          power: 100,
        }),
      ])
    }
  },
})

createApp(App)
  .use(dogePlugin, {
    foo: 100,
    bar: "bar",
    baz: [1, 2, 3, 4, 5],
  })
  .mount("#app")
