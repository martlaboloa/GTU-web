import React from 'react'
import { Grid, Container, Divider, Rail, Button, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'
import webAPIProvider from '../webAPIProvider'
import BookSnippet from '../shared/BookSnippet'
import selectors from '../store/categories/selectors'
import actions from '../store/categories/actions'

class Saved extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      bookList: [],
    }

    this.handleRemoveFromSaved = this.handleRemoveFromSaved.bind(this)
  }

  componentDidMount() {
    const { savedBookIds } = this.props

    this.setState({ bookList: new Array(savedBookIds.length).fill(null) })

    savedBookIds.forEach((nextBookId, bookIndex) => {
      this.props.webAPI.googleBooks.queryVolumeById({
        id: nextBookId,
        pendingName: 'bookById-' + nextBookId,
      }).then(response => {
        const arrayCopy = [...this.state.bookList]

        arrayCopy.splice(bookIndex, 1, response)

        this.setState({ bookList: arrayCopy })
      })
    })
  }

  handleRemoveFromSaved({ id }, index) {
    return () => {
      this.setState(state => ({
        bookList: state.bookList.filter((unused, nextIndex) => nextIndex !== index),
      }))

      this.props.removeFromSaved(id)
    }
  }

  render() {
    const { savedBookIds } = this.props
    const { bookList } = this.state

    return (
      <Container>
        {!bookList.length && (
          <div>Saved categpory is empty</div>
        )}

        <Grid>
          {
            bookList.map((nextItem, nextIndex) => (nextItem ? (
              <div key={nextItem.id}>
                <Grid.Row>
                  <Rail position='left'>
                  </Rail>

                  <BookSnippet data={nextItem} />

                  <Button
                    color='red'
                    onClick={this.handleRemoveFromSaved(nextItem, nextIndex)}
                    style={{ marginTop: '15px' }}
                  >
                    <Icon name='delete' /> Remove
                  </Button>
                </Grid.Row>

                <Divider />
              </div>
            ) : (
              <div key={savedBookIds[nextIndex]}>books fetching</div>
            )))
          }
        </Grid>
      </Container>
    )
  }
}

export default connect(
  state => ({ savedBookIds: selectors.getSavedBookIds(state) }),
  {
    removeFromSaved: actions.removeFromSaved,
  },
)(webAPIProvider()(Saved))
