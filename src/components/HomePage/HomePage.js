import { Box } from "@mui/system";
import { useState } from "react";
import Cryptos from "./Cryptos";
import Stocks from "./Stocks";
import TrendingSecurities from "./TrendingSecurities";

export default function HomePage() {
    
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <TrendingSecurities></TrendingSecurities>
            {/* <RenderSecurities></RenderSecurities> */}
        </Box>
    )
}