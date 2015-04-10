# Banyan-react-tree

Banyan-react-tree is a tree component for react.

Example using ajax:

```html
React.render(
    <Tree url="/examples/data/"></Tree>
);
```

Example using data:

```js
var data = [
    {name: 'Node1', id: 1},
    {
        name: 'Node2',
        id: 2,
        children: [
            {name: 'Child1', id: 3}
        ]
    }
];

React.render(
    <Tree data="{data}"></Tree>
);
```

## Options

### autoOpen

Auto open the tree. Options:


* **true**: open all levels

* **false**: don't auto-open

* **[integer]**: open this level

### data

Initialize the tree using a nested array of tree nodes.

### keyboardSupport

Enable keyboard. Keys are up, down, left and right.

### onError

Callback for when an error occurs.

### onInit

Callback for when the tree is initialized.

### saveState

Restore the previous state of the tree.

### url

Load the data using ajax from this url.
