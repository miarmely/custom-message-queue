import { useState } from 'react'
import '../css/App.css'

function App() {
    const [count, setCount] = useState(0)

    return (
        <div className="miar-form">
            <form method="GET" action="http://localhost:3000/register">
                <table>
                    <thead>
                        <tr>
                            <th colSpan="2">KULLANICI KAYIT</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td><label htmlFor="inpt_firstName">Ad</label></td>
                            <td><input id="inpt_firstName" type="text" name="firstName" /></td>
                        </tr>

                        <tr>
                            <td><label htmlFor="inpt_lastName">Soyad</label></td>
                            <td><input id="inpt_lastName" type="text" name="lastName" /></td>
                        </tr>

                        <tr>
                            <td><label htmlFor="inpt_email">Email</label></td>
                            <td><input id="inpt_email" type="text" name="email" /></td>
                        </tr>
                    </tbody>

                    <tfoot>
                        <tr>
                            <td colSpan="2"><button type="submit">Save</button></td>
                        </tr>

                        <tr>
                            <td colSpan="2">Result</td>
                        </tr>
                    </tfoot>

                </table>
            </form>
        </div >
    )
}

export default App