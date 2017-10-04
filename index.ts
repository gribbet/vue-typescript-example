import Vue from "vue";
import Component from "vue-class-component";

interface Widget {
    id: number;
    name: string;
}

interface WidgetService {
    save(widget: Widget): Promise<void>;
    list(): Promise<Widget[]>;
    delete(id: number): Promise<void>;
}

function delay(time: number): Promise<void> {
    return new Promise(resolve => setTimeout(() => resolve(), time));
}

class DummyWidgetService implements WidgetService {
    private widgets: Widget[] = [
        { id: Math.random(), name: "Test" },
        { id: Math.random(), name: "Test2" }
    ];

    async save(widget: Widget) {
        await delay(100);
        this.widgets = this.widgets
            .concat(widget);
    }

    async list(): Promise<Widget[]> {
        await delay(100);
        return this.widgets.slice(0);
    }

    async delete(id: number) {
        await delay(100);
        this.widgets = this.widgets
            .filter(_ => _.id !== id);
    }
}

@Component({
    template: `
        <div class="widget">
            {{widget.id}}
            {{widget.name}}
            <button v-on:click="remove">Remove</button>
        </div>`,
    props: ["widget", "remove"]
})
class WidgetVue extends Vue { }
Vue.component("widget", WidgetVue);

@Component({
    template: `
        <div class="widgets">
            <button v-on:click="onNew">New</button>
            <widget v-for="widget in widgets" :key="widget.id" :widget="widget" :remove="onRemove(widget)" />
        </div>`
})
class WidgetsVue extends Vue {
    private widgetService = new DummyWidgetService();

    private widgets: Widget[] = [];

    private async update() {
        this.widgets = await this.widgetService.list();
    }

    onRemove(widget: Widget) {
        return async () => {
            await this.widgetService.delete(widget.id);
            await this.update();
        }
    }

    async onNew() {
        await this.widgetService.save({ id: Math.random(), name: "Test" });
        await this.update();
    }

    created() {
        this.update();
    }
}
Vue.component("widgets", WidgetsVue);

@Component({
    template: `
        <div id="application">
            <widgets />
        </div>`
})
class Application extends Vue {}

new Application({
    el: "#application"
});
