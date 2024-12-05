import { FC } from 'react'
import { RoomType } from './chat'
interface roomsProps {
    chatRooms: RoomType[]
    selectRoom: (item: RoomType) => void
}

const rooms: FC<roomsProps> = ({ chatRooms, selectRoom }) => {
    return (
        <>
            <div className='w-1/4 h-full p-6 border-2 rounded-lg'>
                <h1 className='text-4xl p-2 text-center'>Chat Rooms</h1>
                <ol className='content-center'>
                    {
                        chatRooms.map((item, i) => {
                            return <li
                                key={i}
                                className='text-center cursor-pointer rounded-lg m-2 transition-all hover:bg-[#61A653]'
                                onClick={() => { selectRoom(item) }}
                            >{item.room}</li>
                        })
                    }
                </ol>
            </div>
        </>
    )
}

export default rooms