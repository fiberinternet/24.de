/*jshint esversion: 6 */
document.addEventListener("DOMContentLoaded", function () {
    'use strict';
    const inputElm = document.querySelectorAll('.InteractiveMap .map-canvas');

    inputElm.forEach((elem, i) => {
        //get config data element
        const dataElement = document.getElementById(elem.id + '-data');

        if (dataElement) {
            const config = JSON.parse(dataElement.textContent);

            //default icons
            const customIcon = L.icon({
                iconUrl: config.theme_url + '/assets/leaflet/images/marker-icon.png',
                iconSize: [25, 41],
                shadowUrl: config.theme_url + '/assets/leaflet/images/marker-shadow.png',
                shadowSize: [41, 41],
                shadowAnchor: [13, 41],
                iconAnchor: [13, 41],
                popupAnchor: [0, -33],
                tooltipAnchor: [0, 0]
            });

            const customIconActive = customIcon;

            //create category icons
            const markerCategoryIcons = {};
            Object.entries(config.markerCategories).forEach(([key, value]) => {
                markerCategoryIcons[key] = L.divIcon(
                    {
                        className: value
                    }
                );
            });

            //map options
            const map = L.map(elem.id, {
                center: [
                    config.center.lat,
                    config.center.lng,
                ],
                zoom: config.zoom,
                scrollWheelZoom: config.scrollwheel,
                zoomControl: config.show_map_ui,
            });

            //copyright
            map.attributionControl.addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende').setPosition(config.copyright_position);

            //map tiles
            L.tileLayer(
                '/?m=PageContents&v=map&z={z}&x={x}&y={y}'
            ).addTo(map);

            //marker cluster
            const markers = config.marker_clustering ? L.markerClusterGroup() : L.featureGroup();

            //create markers
            markers.addTo(map);

            let activeMarker;

            config.markers.forEach((markerData) => {
                //create marker
                const marker = L.marker(
                    [
                        markerData.lat,
                        markerData.lng
                    ]
                )
                .bindPopup(markerData.content)
                .bindTooltip(markerData.title);

                let markerIcon, markerIconActive;

                //set marker icon
                if (markerCategoryIcons[markerData.category] !== undefined) {
                    markerIcon = markerCategoryIcons[markerData.category];
                    markerIconActive = markerIcon;
                }
                else {
                    markerIcon = customIcon;
                    markerIconActive = customIconActive;
                }

                marker.setIcon(markerIcon);

                //add marker to map
                marker.addTo(markers);

                //add click event
                marker.on('click', (e) => {
                    const clickedMarker = e.target;

                    //toggle marker icon
                    if (typeof activeMarker !== 'undefined') {
                        activeMarker.setIcon(markerIcon);
                    }

                    activeMarker = marker;
                    clickedMarker.setIcon(markerIconActive);

                    //center marker on click
                    if (clickedMarker.getPopup()) {
                        //marker and popup
                        const popup = clickedMarker.getPopup(),
                        px = map.project(popup.getLatLng()),
                        images = popup.getElement().querySelectorAll('img');

                        if (images.length) {
                            //wait for images to load
                            images.forEach((item) => {
                                item.on('load', () => {
                                    px.y -= popup.getElement().offsetHeight / 2;
                                    map.panTo(map.unproject(px));
                                });
                            });
                        }
                        else {
                            px.y -= popup.getElement().offsetHeight / 2;
                            map.panTo(map.unproject(px));
                        }
                    }
                    else {
                        //marker only
                        map.panTo(clickedMarker.getLatLng());
                    }
                });
            });
        }
    });
});
