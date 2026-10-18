import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { makeObservable, observable, action } from "mobx";
import { types, getRoot } from "mobx-state-tree";

const store = createMstStore();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App store={store} />
  </StrictMode>,
);

function createMstStore() {
  const BaseElement = types
    .model({
      id: types.optional(types.identifier, () =>
        (Date.now() * Math.random()).toString(),
      ),
      title: "",
    })
    .actions((self) => ({
      setTitle(title) {
        self.title = title;
      },
    }));

  const TextItem = types
    .compose(
      BaseElement,
      types.model({ type: types.literal("text"), text: "" }),
    )
    .actions((self) => ({
      setText(value) {
        self.text = value;
      },
    }));

  const VideoItem = types
    .compose(
      BaseElement,
      types.model({ type: types.literal("video"), src: "" }),
    )
    .actions((self) => ({
      setSrc(value) {
        self.src = value;
      },
    }));

  const Item = types.union(TextItem, VideoItem);

  const Unit = types
    .compose(
      BaseElement,
      types.model({
        items: types.array(Item),
      }),
    )
    .actions((self) => ({
      addItem(type) {
        self.items.push({ type, title: `New ${type}` });
      },
      deleteItem(item) {
        const store = getRoof(self);
        store.setSelectedElement(undefined);

        const index = self.items.findIndex((_item) => _item.id === item.id);
        set.items.splice(index, 1);
      },
    }));

  const Section = types
    .compose(
      BaseElement,
      types.model({
        units: types.array(Unit),
      }),
    )
    .actions((self) => ({
      addUnit() {
        self.units.push({
          title: "New Unit",
        });
      },
      deleteUnit(unit) {
        const store = getRoot(self);
        store.setSelectedElement(undefined);

        const index = self.units.findIndex((_unit) => _unit.id === unit.id);
        self.units.splice(index, 1);
      },
    }));

  const Element = types.union(Section, Unit, Item);

  const Store = types
    .model({
      sections: types.array(Section),
      selectedElement: types.maybe(types.reference(Element)),
    })
    .actions((self) => {
      return {
        setSelectedElement(element) {
          self.selectedElement = element;
        },
        addSection() {
          self.sections.push({
            title: "New Section",
          });
        },
        deleteSection(sectionToDelete) {
          self.setSelectedElement(undefined);

          const index = self.sections.findIndex(
            (section) => section.id === sectionToDelete.id,
          );
          self.sections.splice(index, 1);
        },
      };
    });

  return Store.create({
    sections: [
      {
        title: "Einleitung",
        units: [
          {
            title: "Kapitel 1",
            items: [
              { title: "Grundlagen", type: "text" },
              { title: "Erklärvideo", type: "video" },
            ],
          },
        ],
      },
      { title: "Erweiterungen" },
      {
        title: "Fertigstellung",
        units: [
          { title: "Alpha-Test" },
          {
            title: "Beta-Test",
            items: [
              { title: "Text 1", type: "text" },
              { title: "Video 1", type: "video" },
            ],
          },
        ],
      },
    ],
  });
}
