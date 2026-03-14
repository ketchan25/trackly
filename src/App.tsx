import { Sidebar } from './layout/Sidebar'
import { Wrapper } from './layout/Wrapper'
import { Kanban } from './layout/Kanban'
import { Main } from './layout/Main'
import { Content } from './layout/Content'
import { Navbar } from './layout/Navbar'

function App() {

  return (
    <>
      <Main>
          <Wrapper>
              <Sidebar/>
              <Content>
                <Navbar/>
                <Kanban/>
              </Content>
          </Wrapper>
      </Main>
    </>
  )
}

export default App
