import { Card, CardContent } from '@mui/material'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import { Grid } from '@mui/material'
const SecurityInfo = (props) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: 2
            }}
        >
            <Card sx={{}}>
                <CardContent>
                    <Typography variant='h6' component='div'>
                        Apple Inc. (AAPL)
                    </Typography>
                    <Grid container spacing = {2} direction = 'row'>
                        <Grid item>
                            <Typography sx = {{fontSize: 35}} variant = 'h3' component='div'>
                                currentPriceHere
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography sx = {{fontSize: 20, marginTop: 0.5}}variant = 'h6' component='div'>
                                priceDif (+-0.00%)                              
                            </Typography>
                        </Grid>
                    </Grid>                    
                </CardContent>
            </Card>
        </Box>
    )

}

export default SecurityInfo