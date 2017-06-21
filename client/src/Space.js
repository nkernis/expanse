class Space {
  constructor(title, creator) {
    this.id
    this.title = title
    this.creator = creator
    this.adapter = new Adapter
    this.nodeList = []
    this.creationStep = {}
    this.nextNode = 0
    this.stage = new createjs.Stage("space")
    this.stage.enableDOMEvents(true)
    this.stage.on("click", this.setParent.bind(this))
    this.boxChangeLeft = 100
    this.boxChangeRight = 100
    this.lineChangeLeft = 75
    this.lineChangeRight = 125
    this.parentIdInput = $("#node-parent-id")
    this.save()
  }

  save(){
    this.adapter.createSpace({title: this.title, creator: this.creator})
      .then(resp => resp.json())
      .then(json => this.id = json.data.id)
  }

  fetchNodes() {
    this.adapter.getSpaceById(this.id)
      .then(resp => resp.json())
      .then(json => {
        this.nodeList = []
        json.nodes.forEach(node => this.addNode(node))
      })
      .then(() => this.render())
  }

  addNode(obj) {
    var newNode = new Node(this, obj.id, obj.title, obj.body, obj.space_id, obj.parent_id, obj.num_child)
    this.nodeList.push(newNode)
  }

  nodeDim(parentId) {
    if (!parentId) {
      return [[this.stage.canvas.width / 2, 5, 50, 50], [0]]
    } else {
      // console.log(this.nodeList)
      let currentNodeParent = this.nodeList.find(node => node.id === parentId)
      let parentX = currentNodeParent.container.x
      let parentY = currentNodeParent.container.y
      let childMade = this.creationStep.parentId

      console.log(childMade)

      // array format: [[x, y, w, h], [startX, startY, endX, endY]]
      if (childMade === 0) {
          console.log(this.creationStep)
          this.creationStep.parentId++
          console.log(this.creationStep)
          return [[parentX, parentY + 100, 50, 50], [parentX, parentY + 55, parentX, parentY + 100]]

      } else if (childMade % 2 === 0) {
          let x = [[(this.stage.canvas.width / 2) - this.boxChangeLeft, 100, 50, 50], [(this.stage.canvas.width / 2) + 25, 55, (this.stage.canvas.width / 2) - this.lineChangeLeft, 100]]
          this.boxChangeLeft += 100
          this.lineChangeLeft += 100
          this.creationStep.parentId++
          return x

        } else if (childMade % 2 !== 0) {
          let x = [[(this.stage.canvas.width / 2) + this.boxChangeRight, 100, 50, 50], [(this.stage.canvas.width / 2) + 25, 55, (this.stage.canvas.width / 2) + this.lineChangeRight, 100]]
          this.boxChangeRight += 100
          this.lineChangeRight += 100
          this.creationStep.parentId++
          return x
        }
      }


    // if (this.nextNode === 0) {
    //     return [[this.stage.canvas.width / 2, 5, 50, 50], [0]]
    // } else if (this.nextNode === 1) {
    //     return [[this.stage.canvas.width / 2, 100, 50, 50], [(this.stage.canvas.width / 2) + 25, 55, (this.stage.canvas.width / 2) + 25, 100]]
    // } else if (this.nextNode % 2 === 0) {
    //     let x = [[(this.stage.canvas.width / 2) - this.boxChangeLeft, 100, 50, 50], [(this.stage.canvas.width / 2) + 25, 55, (this.stage.canvas.width / 2) - this.lineChangeLeft, 100]]
    //     this.boxChangeLeft += 100
    //     this.lineChangeLeft += 100
    //     return x
    //   } else if (this.nextNode % 2 !== 0) {
    //     let x = [[(this.stage.canvas.width / 2) + this.boxChangeRight, 100, 50, 50], [(this.stage.canvas.width / 2) + 25, 55, (this.stage.canvas.width / 2) + this.lineChangeRight, 100]]
    //     this.boxChangeRight += 100
    //     this.lineChangeRight += 100
    //     return x
    //   }
  }

  setParent(event) {
    for (let i = 0; i < this.nodeList.length; i++) {
      if (this.nodeList[i].container.children[0].name === event.target.name) {
        this.parentIdInput.val(event.target.name)
      }
    }
  }

  renderSpace() {
    this.stage.removeAllChildren()
    for (let i = 0; i < this.nodeList.length; i++) {
      this.creationStep[`${this.nodeList[i].id}`] = 0

      this.nodeList[i].render(this.nodeDim(this.nodeList[i].parentId))

      this.stage.addChild(this.nodeList[i].container)

      if (this.nodeList[i].parentId) {this.stage.addChild(this.nodeList[i].line)}
    }
    this.stage.update()
    this.creationStep = {}
    this.boxChangeLeft = 100
    this.boxChangeRight = 100
    this.lineChangeLeft = 75
    this.lineChangeRight = 125
  }

  render() {
    this.renderSpace()
  }
}
