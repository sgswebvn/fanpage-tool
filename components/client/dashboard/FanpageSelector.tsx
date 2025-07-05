import { useEffect, useState } from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import api from "../../../services/api";

export default function FanpageSelector({ selected, onSelect }: { selected: string | null, onSelect: (id: string) => void }) {
    const [pages, setPages] = useState<any[]>([]);
    useEffect(() => {
        api.get("/pages").then(res => setPages(res.data));
    }, []);
    return (
        <List>
            {pages.map(page => (
                <ListItem
                    key={page.pageId}
                    button
                    selected={selected === page.pageId}
                    onClick={() => onSelect(page.pageId)}
                >
                    <ListItemText primary={page.name} />
                </ListItem>
            ))}
        </List>
    );
}