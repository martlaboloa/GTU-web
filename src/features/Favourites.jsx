import React from 'react'
import { Grid, Container, Divider, Rail, Button, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'
import webAPIProvider from '../webAPIProvider'
import BookSnippet from '../shared/BookSnippet'
import selectors from '../store/categories/selectors'
import actions from '../store/categories/actions'

class Favourites extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      bookList: [],
    }

    this.handleRemoveFromFavourites = this.handleRemoveFromFavourites.bind(this)
  }

  componentDidMount() {
    const { favouritesBookIds } = this.props

    this.setState({ bookList: new Array(favouritesBookIds.length).fill(null) })

    favouritesBookIds.forEach((nextBookId, bookIndex) => {
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

  handleRemoveFromFavourites({ id }, index) {
    return () => {
      this.setState(state => ({
        bookList: state.bookList.filter((unused, nextIndex) => nextIndex !== index),
      }))

      this.props.removeFromFavourites(id)
    }
  }

  render() {
    const { favouritesBookIds } = this.props
    const { bookList } = this.state

    return (
      <Container>
        {!bookList.length && (
          <div>Favourites categpory is empty</div>
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
                    onClick={this.handleRemoveFromFavourites(nextItem, nextIndex)}
                    style={{ marginTop: '15px' }}
                  >
                    <Icon name='delete' /> Remove
                  </Button>
                </Grid.Row>

                <Divider />
              </div>
            ) : (
              <div key={favouritesBookIds[nextIndex]}>...</div>
            )))
          }
        </Grid>
      </Container>
    )
  }
}

export default connect(
  state => ({ favouritesBookIds: selectors.getFavouritesBookIds(state) }),
  {
    removeFromFavourites: actions.removeFromFavourites,
  },
)(webAPIProvider()(Favourites))
