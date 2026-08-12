import { useBuilderStore } from "../src/core/builder/store";
import { BuilderNode } from "../src/core/builder/types";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function runTests() {
  console.log("Starting Builder Store Tests...");
  const store = useBuilderStore.getState();

  // Test 1: Initialization
  store.loadDocument({
    version: 1,
    root: {
      id: "root-1",
      type: "Container",
      props: {},
      styles: {},
      children: []
    }
  });

  let state = useBuilderStore.getState();
  assert(state.nodes.length === 1, "Root node should be loaded");
  assert(state.nodes[0].id === "root-1", "Root node ID mismatch");
  assert(state.past.length === 0, "History should be empty on load");

  // Test 2: Add Node
  store.addNode({
    id: "child-1",
    type: "Heading",
    props: { text: "Hello" },
    children: []
  }, "root-1");

  state = useBuilderStore.getState();
  assert(state.nodes[0].children!.length === 1, "Child should be added");
  assert(state.nodes[0].children![0].id === "child-1", "Child ID mismatch");
  assert(state.past.length === 1, "History should have 1 entry");

  // Test 3: Update Props
  store.updateNodeProps("child-1", { text: "World" });
  state = useBuilderStore.getState();
  assert(state.nodes[0].children![0].props.text === "World", "Props should be updated");

  // Test 4: Undo
  store.undo();
  state = useBuilderStore.getState();
  assert(state.nodes[0].children![0].props.text === "Hello", "Undo should revert props");

  // Test 5: Redo
  store.redo();
  state = useBuilderStore.getState();
  assert(state.nodes[0].children![0].props.text === "World", "Redo should restore props");

  // Test 6: Duplicate Node
  store.duplicateNode("child-1");
  state = useBuilderStore.getState();
  assert(state.nodes[0].children!.length === 2, "Node should be duplicated");
  assert(state.nodes[0].children![1].props.text === "World", "Duplicated node should have same props");
  assert(state.nodes[0].children![1].id !== "child-1", "Duplicated node must have new ID");

  // Test 7: Move Node (Reorder)
  const child2Id = state.nodes[0].children![1].id;
  store.moveNode(child2Id, "root-1", 0); // Move to beginning
  state = useBuilderStore.getState();
  assert(state.nodes[0].children![0].id === child2Id, "Node should be moved to front");
  
  // Test 8: Remove Node
  store.removeNode("child-1");
  state = useBuilderStore.getState();
  assert(state.nodes[0].children!.length === 1, "Node should be removed");
  assert(state.nodes[0].children![0].id === child2Id, "Correct node should remain");

  console.log("✅ All Builder Store Tests Passed!");
}

runTests();
