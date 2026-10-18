import { useState, useRef } from "react";
import "./App.css";
import { observer } from "mobx-react-lite";

const Section = observer(_Section);
const Unit = observer(_Unit);
const MediaItem = observer(_MediaItem);

function App({ store }) {
  return (
    <div
      className="App"
      style={{ display: "flex", flexDirection: "row", gap: "8px" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <span>Sections:</span>
          <button onClick={() => store.addSection()}>+</button>
        </div>
        {store.sections.map((section) => (
          <Section key={section.id} section={section} store={store}></Section>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {store.selectedElement && (
          <input
            value={store.selectedElement && store.selectedElement.title}
            onChange={(e) => {
              store.selectedElement.setTitle(e.target.value);
            }}
          ></input>
        )}

        {renderTypeSpecificInputUI(store)}
      </div>
    </div>
  );
}

function renderTypeSpecificInputUI(store) {
  const element = store.selectedElement;
  const type = element && "type" in element ? element.type : null;

  if (!type) return null;

  switch (element.type) {
    case "text":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>Text:</span>
          <textarea
            value={element.txt}
            onChange={(e) => {
              element.setText(e.target.value);
            }}
          ></textarea>
        </div>
      );
    case "video":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>Source-URL:</span>
          <input
            value={element.src}
            onChange={(e) => {
              element.setSrc(e.target.value);
            }}
          ></input>
        </div>
      );
  }
}

export default observer(App);

function _Section({ section, store }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginLeft: "16px",
      }}
    >
      <div style={{ display: "flex", gap: "8px" }}>
        <div
          onClick={() => store.setSelectedElement(section)}
          style={{
            backgroundColor: getSelectionBackgroundColor(store, section.id),
            color: getSelectionTextColor(store, section.id),
          }}
        >
          {section.title}
        </div>
        <button onClick={() => store.deleteSection(section)}>X</button>
        <button onClick={() => section.addUnit()}>+</button>
      </div>

      {section.units.map((unit) => (
        <Unit key={unit.id} section={section} store={store} unit={unit}></Unit>
      ))}
    </div>
  );
}

function _Unit({ section, store, unit }) {
  const newItemTypeRef = useRef();

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginLeft: "16px",
        }}
      >
        <div
          onClick={() => store.setSelectedElement(unit)}
          style={{
            background: getSelectionBackgroundColor(store, unit.id),
            color: getSelectionTextColor(store, unit.id),
            cursor: "pointer",
            padding: "2px 4px",
          }}
        >
          {unit.title}
        </div>
        <button onClick={() => section.deleteUnit(unit)}>x</button>
        <select ref={newItemTypeRef}>
          <option value={"text"}>Text</option>
          <option value={"video"}>Video</option>
        </select>
        <button onClick={() => unit.addItem(newItemTypeRef.current.value)}>
          +
        </button>
      </div>

      {unit.items.length > 0 &&
        unit.items.map((item) => (
          <MediaItem
            key={item.id}
            store={store}
            item={item}
            unit={unit}
          ></MediaItem>
        ))}
    </div>
  );
}

function _MediaItem({ item, store, unit }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        marginLeft: "16px",
        backgroundColor: getSelectionBackgroundColor(store, item.id),
        color: getSelectionTextColor(store, item.id),
        cursor: "pointer",
        padding: "2px 4px",
      }}
    >
      <span onClick={() => store.setSelectedElement(item)}>{item.title}</span>
      <button onClick={() => unit.deleteItem(item)}>x</button>
    </div>
  );
}

function getSelectionBackgroundColor(store, id) {
  return store.selectedElement?.id === id ? "blue" : "white";
}
function getSelectionTextColor(store, id) {
  return store.selectedElement?.id === id ? "white" : "black";
}
