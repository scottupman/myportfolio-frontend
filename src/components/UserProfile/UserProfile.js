import { Box, Card, Grid, Avatar, Typography, IconButton } from "@mui/material";
import Axios from "axios"
import { useEffect, useState } from "react"
import AccountCircle from '@mui/icons-material/AccountCircle';
import EditableTextField from "EditableTextField";

export default function UserProfile({ username }) {

    const [userInfo, setUserInfo] = useState(null)
    useEffect(() => {
        fetchUserInfo();
    }, [])

    const fetchUserInfo = () => {
        let url = `http://localhost:8080/user/${username}`
        Axios.get(url).then(response => setUserInfo(response.data))
    }
    return (
        <Box sx=
            {{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            <Card sx={{ minWidth: 500 }}>
                <Grid
                    container spacing={1}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Grid item>
                        <AccountCircle sx={{ fontSize: 100 }} />
                    </Grid>
                    <Grid item xs="auto">
                        <Typography variant="h4" component="div">{username}</Typography>
                    </Grid>
                </Grid>
                {/*define a box */}
                <Box sx=
                    {{
                        marginTop: 4,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 500,
                        border: 2,
                    }}
                >
                    <Grid
                        container spacing={2}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        border={2}
                    >
                        <Grid item >
                            <Typography variant="h6" component="div">First name:</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" component="div">Last name:</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" component="div">Email:</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" component="div">DOB:</Typography>
                        </Grid>
                    </Grid>
                    <Grid
                        container spacing={2}
                        direction="column"
                    >
                        {userInfo === null ? null : (
                            <>
                                <Grid item>
                                    <EditableTextField value={userInfo.fname} fieldType="fname" />
                                </Grid>
                                <Grid item>
                                    <EditableTextField value={userInfo.lname} fieldType="lname" />
                                </Grid>
                                <Grid item>
                                    <EditableTextField value={userInfo.email} fieldType="email" />
                                </Grid>
                                <Grid item>
                                    <Typography variant="h6" component="div">{userInfo.dob}</Typography>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Box>
            </Card>
        </Box>
    )
}