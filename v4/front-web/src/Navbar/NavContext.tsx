import React from 'react'

//lets NavMenu know whether it is being rendered in the desktop bar (where it
//is a dropdown) or in the mobile drawer (where it is an open section)
export const NavContext = React.createContext<{mobile:boolean}>({mobile:false})
