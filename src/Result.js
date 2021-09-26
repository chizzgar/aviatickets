import React from "react";

const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 1,
            border: "none",
            width: "100%",
            margin: "0.625rem 0 0 0"


        }}
    />
);

const transfersLang = (count) => {
    if (Math.floor((count % 100) / 10) !== 1) {
        if (count % 10 > 1 && count % 10 < 5) {
            return 'пересадки';
        }

        if (count % 10 === 1) {
            return 'пересадка';
        }
    }

    return 'пересадок';
}

function Time({ time }) {
    return (
        <>
            {new Date(time).toLocaleString()}
        </>
    )
};

function Transfers({ count, style }) {
    return (
        <div style={style}>
            {count ? count + ' ' + transfersLang(count) : ''}
        </div>
    )
}

const duration = (departureTime, arriveTime) => {
    const seconds = (new Date(arriveTime).valueOf() - new Date(departureTime).valueOf()) / 1000;

    const hours = Math.floor(seconds / (60 * 60));
    const mins = (seconds % (60 * 60)) / 60;
    return hours + ' ч, '
        + mins + ' мин.';
}

function Flight({ from, to, company, departureDate, arrivalDate, transfers }) {
    return (
        <div>
            <div className="places">
                <span>{from.name}</span> &nbsp;<span style={{ color: '#46B0E2' }}>({from.code})</span> &nbsp;&rarr;&nbsp; <span style={{ textSize: "large" }}>{to.name}</span> &nbsp;<span style={{ color: '#46B0E2' }}>({to.code})</span>
            </div>
            <hr color="#D9D9D9" />

            <div className="times">
                <div className="departure">
                    <Time time={departureDate} />
                </div>
                <div className="duration">
                    &#9719;&nbsp;{duration(departureDate, arrivalDate)}
                </div>
                <div className="arrive">
                    <Time time={arrivalDate} />
                </div>
            </div>
            {(transfers) ? <div className="transfersNormal">

                <ColoredLine color="grey" />
                <Transfers count={transfers} style={{ margin: "0 0.5rem", fonttSize: "50px" }} />
                <ColoredLine color="grey" />

            </div> : <div className="transfersNormal"><ColoredLine color="grey" /></div>}

            {/* <div className="transfers">
                <div>
                    <Transfers count={transfers} />
                </div>
            </div> */}
            <div className="companyLine"><p>Рейс выполняет: {company}</p></div>

        </div>
    );
}

function Result({ company, price, flights }) {
    return (
        <div style={{ marginBottom: "2rem" }}>
            <div className="flightHead">
                <div style={{}}>{company}</div>

                <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "1.5rem" }}>{price} &#8381;</span>
                    <div>Стоимость для одного взрослого пассажира</div>
                </div>
            </div>

            {flights.map((flight, j) => (
                <>
                    {!!j && (
                        <hr style={{ border: "none", height: "0.25rem", backgroundColor: "#0087C9" }} />
                    )}

                    <Flight
                        {...flight}
                    />
                </>
            ))}

            <button className="btn">ВЫБРАТЬ</button>

        </div>
    );
}

export default Result;