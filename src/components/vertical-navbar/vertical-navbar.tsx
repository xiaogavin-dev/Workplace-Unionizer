import React, { useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import './vertical-navbar.css';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar/app-sidebar"
interface Union {
  id: string;
  name: string;
  image?: string;
}

interface VerticalNavbarProps {
  togglePopup: () => void;
  buttonRef: React.RefObject<HTMLImageElement>;
  unions: Union[] | null;
  handleUnionClick: (e: React.MouseEvent, union: Union) => void;
  currUnion: object | null,
  user: object | null,
  children: React.ReactNode
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarOpen: boolean
}

const VerticalNavbar: React.FC<VerticalNavbarProps> = ({
  togglePopup,
  buttonRef,
  unions,
  handleUnionClick,
  currUnion,
  user,
  setSidebarOpen,
  sidebarOpen
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [unionColors, setUnionColors] = useState<Map<string, string>>(
    new Map()
  );
  const handleBookButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (pathname.startsWith('/resources')) {
      setTimeout(() => {
        togglePopup();
      }, 200);
    } else {
      router.push('/resources');
      setTimeout(() => {
        togglePopup();
      }, 200);
    }
  };

  const getRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    if (unions?.length) {
      const savedColors = JSON.parse(
        localStorage.getItem('unionColors') || '{}'
      );
      const colors = new Map<string, string>(Object.entries(savedColors));

      unions.forEach((union) => {
        if (!colors.has(union.id)) {
          colors.set(union.id, getRandomColor());
        }
      });

      setUnionColors(colors);
      localStorage.setItem(
        'unionColors',
        JSON.stringify(Object.fromEntries(colors))
      );
    }
    // socket.current = io(PATH, {
    //   reconnection: true,
    //   reconnectionAttempts: 5,
    //   reconnectionDelay: 1000,
    // });

  }, [unions]);

  useEffect(() => {
    console.log(unions);
  }, [unions]);


  return (
    <>

      {currUnion ?
        <>
          <div className="vertical-navbar">
            <div className="navbar-items">
              {unions?.length ? (
                unions.map((union) => (
                  <div
                    key={union.id}
                    className="navbar-item"
                    onClick={(e) => {
                      handleUnionClick(e, union)
                      setSidebarOpen(true)
                    }}
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    {union.image ? (
                      <img
                        src={`http://localhost:5000${union.image}`}
                        alt={`${union.name} Logo`}
                        className="union-image"
                        style={{ maxHeight: '50px' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement);
                        }}
                      />
                    ) : (
                      <div
                        className="union-initial"
                        style={{
                          backgroundColor: unionColors.get(union.id),
                        }}
                      >
                        {union.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <></>
              )}

              <a href="/search">
                <div className="add-button">+</div>
              </a>
            </div>

            <img
              src="/images/resource-guide-icon.png"
              alt="books"
              className="book-button"
              ref={buttonRef}
              onClick={handleBookButtonClick}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className='absolute'>
            <SidebarProvider>
              {sidebarOpen ?
                <AppSidebar
                  chats={currUnion?.chats || []}
                  unionName={currUnion?.name || ''}
                  unionId={currUnion?.id || ''}
                  role={currUnion?.role || ''}
                  userId={user?.uid}
                /> : <></>
              }
            </SidebarProvider>
          </div>
        </> :
        <>
          <div className="main-container ">
            <div className="vertical-navbar">
              <div className="navbar-items">
                {unions?.length ? (
                  unions.map((union) => (
                    <div
                      key={union.id}
                      className="navbar-item"
                      onClick={(e) => handleUnionClick(e, union)}
                      style={{ display: 'flex', justifyContent: 'center' }}
                    >
                      {union.image ? (
                        <img
                          src={`http://localhost:5000${union.image}`}
                          alt={`${union.name} Logo`}
                          className="union-image"
                          style={{ maxHeight: '50px' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement);
                          }}
                        />
                      ) : (
                        <div
                          className="union-initial"
                          style={{
                            backgroundColor: unionColors.get(union.id),
                          }}
                        >
                          {union.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <></>
                )}

                <a href="/search">
                  <div className="add-button">+</div>
                </a>
              </div>

              <img
                src="/images/resource-guide-icon.png"
                alt="books"
                className="book-button"
                ref={buttonRef}
                onClick={handleBookButtonClick}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div></>}

    </>
  );
};

export default VerticalNavbar;
