import { Sidebar } from './layout/Sidebar'
import { Kanban } from './layout/Kanban'
import { Main } from './layout/Main'
import { Content } from './layout/Content'
import { Navbar } from './layout/Navbar'

function App() {
  return (
    <>
		<Main>
			<Navbar/>
			<Content>
				<Sidebar/>
				<Kanban/>
			</Content>
      	</Main>
    </>
  )
}

export default App
