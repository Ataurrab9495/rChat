import { Skeleton, Stack } from '@mui/material'
import Grid from '@mui/material/Grid'
import React from 'react'

export const LoadersLayout = () => {
  return (
    <Grid container height={"calc(100vh - 4rem)"}>
            <Grid
            size={{sm: 4, md: 3}}
                sx={{
                    display: { xs: 'none', sm: 'block' },
                }}
                height={"100%"}
            >
                <Skeleton height={"100vh"} />
            </Grid>
            <Grid size={{ xs:12, sm:8, md:5, lg:6 }} height={"100%"}>
                <Stack>
                    {
                    Array.from({ length: 10 }).map((_, index) => (
                        <Skeleton key={index} variant="text" height={"5rem"}/>
                    ))
                }
                </Stack>
            </Grid>
            <Grid
                size={{ md:4, lg:3}}
                sx={{
                    display: { xs: 'none', md: 'block' },
                }}
                height={"100%"}
                >
                    <Skeleton height={"100vh"} />
                </Grid>
        </Grid>
  )
}

