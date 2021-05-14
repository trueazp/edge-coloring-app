/**
 *
 * @param nodeList List of all node of cytoscape instance
 */
export default function welshPowell(nodeList) {
  cy.emit("startColoring");
  cy.nodes().forEach((node) => {
    if (
      !(
        node.classes().includes("eh-handle") ||
        node.classes().includes("eh-ghost")
      )
    ) {
      node.style({ "background-color": "#fff" });
    }
  });

  let adjList = [];

  // Filter original node
  let realNodes = nodeList.filter((node) => {
    return !(
      node.classes.includes("eh-handle") || node.classes.includes("eh-ghost")
    );
  });

  realNodes = realNodes.filter((node) => node.data.id.length <= 20);

  // List of node id
  const nodesId = realNodes.map((node) => node.data.id);
  const colorList = [];

  nodesId.forEach((node) => {
    let currentNode = cy.$(`#${node}`);

    const neighbors = currentNode.neighborhood("node").map((node) => node.id());

    adjList.push({
      id: currentNode.id(),
      neighbors,
      degree: currentNode.degree(),
    });
  });

  adjList.sort(function (a, b) {
    return b.degree - a.degree;
  });

  const colored = [];

  for (let i = 0; i < adjList.length; i++) {
    const adjacent = new Set();
    if (!colored.includes(adjList[i].id)) {
      const sameNodeColor = [];

      sameNodeColor.push(adjList[i].id);

      colored.push(adjList[i].id);

      adjList[i].neighbors.forEach((node) => adjacent.add(node));

      for (let j = i + 1; j < adjList.length; j++) {
        if (!(adjacent.has(adjList[j].id) || colored.includes(adjList[j].id))) {
          sameNodeColor.push(adjList[j].id);
          colored.push(adjList[j].id);
          adjList[j].neighbors.forEach((node) => adjacent.add(node));
        }
      }

      const color = randomColor();
      colorList.push({
        nodes: sameNodeColor,
        color,
      });
    }
  }

  console.log(colorList);

  let count = 0;
  for (let i = 0; i < colorList.length; i++) {
    let nodes = colorList[i].nodes;
    let color = colorList[i].color;

    nodes.forEach((node) => {
      setTimeout(function () {
        cy.$(`#${node}`).style({ "background-color": color });
      }, 200 + count);
      count = count + 200;
    });

    count = count + 500;
  }

  setTimeout(() => {
    cy.emit("finished");
  }, count);
}
