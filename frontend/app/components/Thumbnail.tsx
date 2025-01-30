import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";

interface thumbnailView {
    thumbnail: string;
    title: string;
    uploader: string;
}

const Thumbnail = ({ thumbnail, title, uploader }: Readonly<thumbnailView>) => {
    return (
        <Card sx={{ display: 'flex', width: '100%', marginTop: 5 }}>
            <CardMedia
                component="img"
                sx={{ width: 151 }}
                image={thumbnail}
                alt={title}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h5">
                        Title : {title}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        Uploader : {uploader}
                    </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>

                </Box>
            </Box>
        </Card>
    )
}

export default Thumbnail;