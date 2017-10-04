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

class DummyWidgetService implements WidgetService {
    private widgets: Widget[] = [
        { id: Math.random(), name: "Test" },
        { id: Math.random(), name: "Test2" }
    ];
    private dummyWait = () =>
        new Promise(resolve => setTimeout(() => resolve(), 250));

    async save(widget: Widget) {
        await this.dummyWait();
        this.widgets = this.widgets
            .concat(widget);
    }

    async list(): Promise<Widget[]> {
        await this.dummyWait();
        return this.widgets.slice(0);
    }

    async delete(id: number) {
        await this.dummyWait();
        this.widgets = this.widgets
            .filter(_ => _.id !== id);
    }
}

const widgetService: WidgetService = new DummyWidgetService();

@Component({
    template: `
        <div class="widget">
            {{widget.id}}
            {{widget.name}}
            <button v-on:click="onDelete">Delete</button>
        </div>`,
    props: ["widget", "on-update"]
})
class WidgetVue extends Vue {
    widget: Widget;
    onUpdate: () => Promise<void>;

    async onDelete() {
        await widgetService.delete(this.widget.id);
        await this.onUpdate();
    }
}
Vue.component("widget", WidgetVue);

@Component({
    template: `
        <div class="widgets">
            <button v-on:click="onNew">New</button>
            <widget v-for="widget in widgets" :key="widget.id" :widget="widget" :on-update="update" />
        </div>`
})
class WidgetsVue extends Vue {
    widgets: Widget[] = [];

    async update() {
        this.widgets = await widgetService.list();
    }

    async onNew() {
        await widgetService.save({ id: Math.random(), name: "Test" });
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
class Application extends Vue { }

new Application({
    el: "#application"
});
