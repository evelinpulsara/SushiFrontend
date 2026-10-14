export interface paths {
    "/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["staffLogin"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["currentStaff"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getHealth"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/restaurant": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getRestaurantInfo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/zones": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listZones"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/menu": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getMenu"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/availability": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["checkAvailability"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/availability/day": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["checkDayAvailability"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reservations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listReservations"];
        put?: never;
        post: operations["createReservation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reservations/code/{code}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getReservationByCode"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reservations/code/{code}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["cancelReservationByCode"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reservations/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["updateReservationStatus"];
        trace?: never;
    };
    "/reservations/{id}/seat": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["seatReservation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai/wait-estimate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["estimateWait"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai/seat-suggestion": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["suggestSeating"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/waitlist": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listWaitlist"];
        put?: never;
        post: operations["joinWaitlist"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/waitlist/ticket/{ticketCode}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getWaitlistTicket"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/waitlist/ticket/{ticketCode}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["cancelWaitlistTicket"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/waitlist/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["updateWaitlistStatus"];
        trace?: never;
    };
    "/waitlist/{id}/seat": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["seatWaitlistEntry"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/waitlist/{id}/re-estimate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["reEstimateWaitlistEntry"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tables": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listTables"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tables/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["updateTableStatus"];
        trace?: never;
    };
    "/seatings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["seatWalkIn"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/seatings/{id}/release": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["releaseSeating"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/concierge/conversations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["startConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/concierge/conversations/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getConversation"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/concierge/conversations/{id}/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["sendConciergeMessage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/dashboard/overview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getDashboardOverview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/dashboard/kpis": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getKpis"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/dashboard/ai-accuracy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getAIAccuracy"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/dashboard/dining-durations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getDiningDurations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["streamEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ws": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["hostCollaborationSocket"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        LocalDate: string;
        LocalTime: string;
        Language: "es" | "en";
        TableStatus: "available" | "occupied" | "reserved" | "clearing_soon";
        TableShape: "round" | "square" | "rectangle" | "bar_counter" | "tatami";
        ReservationStatus: "pending" | "confirmed" | "seated" | "completed" | "cancelled" | "no_show";
        WaitlistStatus: "waiting" | "notified" | "seated" | "cancelled" | "no_show";
        AssignmentStrategy: "single_table" | "merge_tables" | "wait_for_table" | "alternative_zone";
        MenuItemKind: "food" | "drink";
        ServiceShift: "lunch" | "dinner";
        Allergen: "fish" | "shellfish" | "soy" | "gluten" | "sesame" | "egg" | "dairy" | "tree_nuts" | "peanuts" | "sulfites" | "alcohol";
        DietaryTag: "vegetarian" | "vegan" | "gluten_free" | "raw" | "cooked" | "spicy" | "signature" | "seasonal" | "non_alcoholic";
        StaffRole: "admin" | "host";
        LoginRequest: {
            email: string;
            password: string;
        };
        StaffMember: {
            id: string;
            email: string;
            displayName: string;
            role: components["schemas"]["StaffRole"];
        };
        StaffSession: {
            token: string;
            expiresAt: string;
            staff: components["schemas"]["StaffMember"];
        };
        StaffSessionEnvelope: {
            success: true;
            data: components["schemas"]["StaffSession"];
        };
        StaffMemberEnvelope: {
            success: true;
            data: components["schemas"]["StaffMember"];
        };
        ErrorEnvelope: {
            success: false;
            error: {
                code: string;
                message: string;
                details?: {
                    [key: string]: unknown;
                };
            };
        };
        Zone: {
            id: string;
            code: string;
            nameEs: string;
            nameEn: string;
            descriptionEs: string;
            descriptionEn: string;
            isPremium: boolean;
            displayOrder: number;
        };
        ServiceHour: {
            dayOfWeek: number;
            shift: components["schemas"]["ServiceShift"];
            opensAt: components["schemas"]["LocalTime"];
            lastSeatingAt: components["schemas"]["LocalTime"];
            closesAt: components["schemas"]["LocalTime"];
        };
        RestaurantSettings: {
            restaurantName: string;
            timezone: string;
            currencyCode: string;
            defaultDiningMinutes: number;
            turnoverBufferMinutes: number;
            reservationSlotMinutes: number;
            maxPartySize: number;
            reservedHoldMinutes: number;
        };
        RestaurantInfo: {
            settings: components["schemas"]["RestaurantSettings"];
            serviceHours: components["schemas"]["ServiceHour"][];
            zones: components["schemas"]["Zone"][];
            localNow: {
                date: components["schemas"]["LocalDate"];
                time: components["schemas"]["LocalTime"];
                dayOfWeek: number;
            };
        };
        MenuItem: {
            id: string;
            categoryId: string;
            categorySlug: string;
            kind: components["schemas"]["MenuItemKind"];
            slug: string;
            name: string;
            nameJa: string;
            descriptionEs: string;
            descriptionEn: string;
            price: number;
            allergens: components["schemas"]["Allergen"][];
            dietaryTags: components["schemas"]["DietaryTag"][];
            spiceLevel: number;
            pieces: number | null;
            alcoholPercentage: number | null;
            pairingNotesEs: string | null;
            pairingNotesEn: string | null;
            imageUrl: string | null;
            isAvailable: boolean;
            isFeatured: boolean;
            displayOrder: number;
        };
        MenuCategory: {
            id: string;
            slug: string;
            kind: components["schemas"]["MenuItemKind"];
            nameEs: string;
            nameEn: string;
            nameJa: string;
            displayOrder: number;
            items: components["schemas"]["MenuItem"][];
        };
        Menu: {
            currencyCode: string;
            excludedAllergens: components["schemas"]["Allergen"][];
            categories: components["schemas"]["MenuCategory"][];
        };
        ZoneRef: {
            id: string;
            code: string;
            nameEs: string;
            nameEn: string;
        };
        DiningTable: {
            id: string;
            code: string;
            capacity: number;
            minCapacity: number;
            shape: components["schemas"]["TableShape"];
            status: components["schemas"]["TableStatus"];
            effectiveStatus: components["schemas"]["TableStatus"];
            position: {
                x: number;
                y: number;
            };
            isCombinable: boolean;
            isActive: boolean;
            statusChangedAt: string;
            zone: components["schemas"]["ZoneRef"];
            currentSeating: null | {
                seatingId: string;
                guestName: string;
                partySize: number;
                seatedAt: string;
                expectedEndAt: string;
                minutesSeated: number;
                minutesRemaining: number;
            };
            nextReservation: null | {
                reservationId: string;
                reservationCode: string;
                guestName: string;
                partySize: number;
                reservedAt: string;
                minutesUntil: number;
            };
        };
        NewReservation: {
            guestName: string;
            guestEmail?: string | null;
            guestPhone: string;
            partySize: number;
            date: components["schemas"]["LocalDate"];
            time: components["schemas"]["LocalTime"];
            preferredZoneId?: string | null;
            specialRequests?: string | null;
            dietaryRestrictions?: components["schemas"]["Allergen"][];
        };
        TableRef: {
            id: string;
            code: string;
        };
        Reservation: {
            id: string;
            reservationCode: string;
            guestName: string;
            guestEmail: string | null;
            guestPhone: string;
            partySize: number;
            reservedAt: string;
            endsAt: string;
            durationMinutes: number;
            preferredZone: null | components["schemas"]["ZoneRef"];
            status: components["schemas"]["ReservationStatus"];
            specialRequests: string | null;
            dietaryRestrictions: components["schemas"]["Allergen"][];
            language: components["schemas"]["Language"];
            tables: components["schemas"]["TableRef"][];
            seatedAt: string | null;
            completedAt: string | null;
            cancelledAt: string | null;
            createdAt: string;
        };
        AvailabilityOption: {
            tables: components["schemas"]["TableRef"][];
            zoneCode: string;
            capacity: number;
            isMerged: boolean;
        };
        LocalSlot: {
            date: components["schemas"]["LocalDate"];
            time: components["schemas"]["LocalTime"];
        };
        SlotAvailability: {
            time: components["schemas"]["LocalTime"];
            shift: string;
            isBookable: boolean;
            options: number;
        };
        ZoneFit: {
            zoneId: string;
            zoneCode: string;
            minPartySize: number;
            maxPartySize: number;
            fitsParty: boolean;
        };
        DayAvailability: {
            date: components["schemas"]["LocalDate"];
            partySize: number;
            zoneId: string | null;
            isOpen: boolean;
            slots: components["schemas"]["SlotAvailability"][];
            zones: components["schemas"]["ZoneFit"][];
        };
        Availability: {
            date: components["schemas"]["LocalDate"];
            time: components["schemas"]["LocalTime"];
            partySize: number;
            isBookable: boolean;
            durationMinutes: number;
            options: components["schemas"]["AvailabilityOption"][];
            alternativeTimes: components["schemas"]["LocalSlot"][];
        };
        PredictedTable: {
            id: string;
            code: string;
            zoneCode: string;
            capacity: number;
        };
        WaitEstimate: {
            predictionId: string | null;
            estimatedWaitMinutes: number;
            confidence: number;
            strategy: components["schemas"]["AssignmentStrategy"];
            tables: components["schemas"]["PredictedTable"][];
            reasoning: string;
            alternatives: {
                strategy: components["schemas"]["AssignmentStrategy"];
                tables: components["schemas"]["PredictedTable"][];
                estimatedWaitMinutes: number;
                note: string;
            }[];
            model: string;
            isFallback: boolean;
            generatedAt: string;
        };
        WaitEstimateRequest: {
            partySize: number;
            preferredZoneId?: string | null;
            dietaryRestrictions?: components["schemas"]["Allergen"][];
            language?: components["schemas"]["Language"];
        };
        CreatedReservation: {
            reservation: components["schemas"]["Reservation"];
            assignment: components["schemas"]["WaitEstimate"];
        };
        NewWaitlistEntry: {
            guestName: string;
            guestPhone: string;
            partySize: number;
            preferredZoneId?: string | null;
            dietaryRestrictions?: components["schemas"]["Allergen"][];
            notes?: string | null;
        };
        WaitlistEntry: {
            id: string;
            ticketCode: string;
            guestName: string;
            guestPhone: string;
            partySize: number;
            preferredZoneId: string | null;
            preferredZoneCode: string | null;
            status: components["schemas"]["WaitlistStatus"];
            estimatedWaitMinutes: number | null;
            remainingWaitMinutes: number | null;
            quotedAt: string | null;
            dietaryRestrictions: components["schemas"]["Allergen"][];
            notes: string | null;
            language: components["schemas"]["Language"];
            joinedAt: string;
            notifiedAt: string | null;
            seatedAt: string | null;
            minutesWaiting: number;
            queuePosition: number | null;
        };
        JoinedWaitlist: {
            entry: components["schemas"]["WaitlistEntry"];
            prediction: components["schemas"]["WaitEstimate"];
        };
        SeatSuggestion: {
            focusTableId: string;
            entry: null | components["schemas"]["WaitlistEntry"];
            tables: {
                id: string;
                code: string;
                capacity: number;
            }[];
            confidence: number;
            reasoning: string;
            model: string;
            isFallback: boolean;
        };
        ConciergeConversation: {
            id: string;
            language: components["schemas"]["Language"];
            reservationId: string | null;
            waitlistEntryId: string | null;
            avoidedAllergens: components["schemas"]["Allergen"][];
            createdAt: string;
            updatedAt: string;
        };
        ConciergeMessage: {
            id: string;
            role: "user" | "assistant";
            content: string;
            recommendedItemIds: string[];
            createdAt: string;
        };
        ConciergeTurn: {
            conversation: components["schemas"]["ConciergeConversation"];
            message: components["schemas"]["ConciergeMessage"];
            recommendations: {
                item: components["schemas"]["MenuItem"];
                reason: string;
            }[];
            suggestedSequence: components["schemas"]["MenuItem"][];
            followUpQuestion: string | null;
            estimatedTotal: number;
            currencyCode: string;
            model: string;
            isFallback: boolean;
        };
        LiveKpis: {
            totalTables: number;
            availableTables: number;
            occupiedTables: number;
            reservedTables: number;
            clearingSoonTables: number;
            totalSeats: number;
            seatedGuests: number;
            tableOccupancyRate: number;
            seatEfficiencyRate: number;
            waitingParties: number;
            waitingGuests: number;
            avgCurrentWaitMinutes: number;
            upcomingReservations2h: number;
            aiMeanAbsoluteErrorMinutes: number | null;
        };
        DashboardOverview: {
            generatedAt: string;
            kpis: components["schemas"]["LiveKpis"];
            tables: components["schemas"]["DiningTable"][];
            waitlist: components["schemas"]["WaitlistEntry"][];
            upcomingReservations: components["schemas"]["Reservation"][];
        };
        AccuracySummary: {
            sampleSize: number;
            meanSignedErrorMinutes: number | null;
            meanAbsoluteErrorMinutes: number | null;
            withinFiveMinutesRate: number | null;
        };
        AIAccuracy: {
            last7Days: components["schemas"]["AccuracySummary"];
            last30Days: components["schemas"]["AccuracySummary"];
            recent: {
                predictionId: string;
                waitlistEntryId: string;
                partySize: number;
                estimatedWaitMinutes: number;
                actualWaitMinutes: number;
                errorMinutes: number;
                isFallback: boolean;
                model: string;
                createdAt: string;
            }[];
        };
        DiningDurationStat: {
            zoneCode: string;
            partyBucket: "1-2" | "3-4" | "5-6" | "7+";
            sampleSize: number;
            avgMinutes: number;
            medianMinutes: number;
            p80Minutes: number;
        };
        LiveEvent: {
            name: "tables.updated" | "waitlist.updated" | "reservations.updated" | "kpis.updated";
            occurredAt: string;
            payload: {
                [key: string]: unknown;
            };
        };
        HealthEnvelope: {
            success: true;
            data: {
                [key: string]: unknown;
            };
        };
        RestaurantInfoEnvelope: {
            success: true;
            data: components["schemas"]["RestaurantInfo"];
        };
        ZoneListEnvelope: {
            success: true;
            data: components["schemas"]["Zone"][];
        };
        MenuEnvelope: {
            success: true;
            data: components["schemas"]["Menu"];
        };
        DayAvailabilityEnvelope: {
            success: true;
            data: components["schemas"]["DayAvailability"];
        };
        AvailabilityEnvelope: {
            success: true;
            data: components["schemas"]["Availability"];
        };
        ReservationEnvelope: {
            success: true;
            data: components["schemas"]["Reservation"];
        };
        ReservationListEnvelope: {
            success: true;
            data: components["schemas"]["Reservation"][];
        };
        CreatedReservationEnvelope: {
            success: true;
            data: components["schemas"]["CreatedReservation"];
        };
        WaitEstimateEnvelope: {
            success: true;
            data: components["schemas"]["WaitEstimate"];
        };
        SeatSuggestionEnvelope: {
            success: true;
            data: components["schemas"]["SeatSuggestion"];
        };
        WaitlistEntryEnvelope: {
            success: true;
            data: components["schemas"]["WaitlistEntry"];
        };
        WaitlistListEnvelope: {
            success: true;
            data: components["schemas"]["WaitlistEntry"][];
        };
        JoinedWaitlistEnvelope: {
            success: true;
            data: components["schemas"]["JoinedWaitlist"];
        };
        TableEnvelope: {
            success: true;
            data: components["schemas"]["DiningTable"];
        };
        TableListEnvelope: {
            success: true;
            data: components["schemas"]["DiningTable"][];
        };
    };
    responses: {
        ValidationError: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        NotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        ConflictError: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        BusinessRuleError: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        Unauthorized: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        Forbidden: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        RateLimited: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
    };
    parameters: {
        Id: string;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    staffLogin: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginRequest"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StaffSessionEnvelope"];
                };
            };
            400: components["responses"]["ValidationError"];
            401: components["responses"]["Unauthorized"];
            429: components["responses"]["RateLimited"];
        };
    };
    currentStaff: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StaffMemberEnvelope"];
                };
            };
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["Forbidden"];
        };
    };
    getHealth: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthEnvelope"];
                };
            };
        };
    };
    getRestaurantInfo: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RestaurantInfoEnvelope"];
                };
            };
        };
    };
    listZones: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ZoneListEnvelope"];
                };
            };
        };
    };
    getMenu: {
        parameters: {
            query?: {
                excludeAllergens?: string;
                category?: string;
                featured?: "true" | "false";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MenuEnvelope"];
                };
            };
            400: components["responses"]["ValidationError"];
        };
    };
    checkAvailability: {
        parameters: {
            query: {
                date: components["schemas"]["LocalDate"];
                time: components["schemas"]["LocalTime"];
                partySize: number;
                zoneId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AvailabilityEnvelope"];
                };
            };
            400: components["responses"]["ValidationError"];
            422: components["responses"]["BusinessRuleError"];
        };
    };
    checkDayAvailability: {
        parameters: {
            query: {
                date: components["schemas"]["LocalDate"];
                partySize: number;
                zoneId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DayAvailabilityEnvelope"];
                };
            };
            400: components["responses"]["ValidationError"];
            404: components["responses"]["NotFound"];
        };
    };
    listReservations: {
        parameters: {
            query?: {
                date?: components["schemas"]["LocalDate"];
                status?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReservationListEnvelope"];
                };
            };
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["Forbidden"];
        };
    };
    createReservation: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["NewReservation"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CreatedReservationEnvelope"];
                };
            };
            400: components["responses"]["ValidationError"];
            409: components["responses"]["ConflictError"];
            422: components["responses"]["BusinessRuleError"];
        };
    };
    getReservationByCode: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                code: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReservationEnvelope"];
                };
            };
            404: components["responses"]["NotFound"];
        };
    };
    cancelReservationByCode: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                code: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReservationEnvelope"];
                };
            };
            404: components["responses"]["NotFound"];
            409: components["responses"]["ConflictError"];
        };
    };
    updateReservationStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["Id"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    status: "confirmed" | "cancelled" | "no_show";
                };
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReservationEnvelope"];
                };
            };
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["Forbidden"];
            409: components["responses"]["ConflictError"];
        };
    };
    seatReservation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["Id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    tableIds?: string[];
                };
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReservationEnvelope"];
                };
            };
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["Forbidden"];
            409: components["responses"]["ConflictError"];
        };
    };
    estimateWait: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WaitEstimateRequest"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WaitEstimateEnvelope"];
                };
            };
            400: components["responses"]["ValidationError"];
            429: components["responses"]["RateLimited"];
        };
    };
    suggestSeating: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    tableId: string;
                };
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SeatSuggestionEnvelope"];
                };
            };
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["NotFound"];
        };
    };
    listWaitlist: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WaitlistListEnvelope"];
                };
            };
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["Forbidden"];
        };
    };
    joinWaitlist: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["NewWaitlistEntry"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JoinedWaitlistEnvelope"];
                };
            };
            400: components["responses"]["ValidationError"];
        };
    };
    getWaitlistTicket: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                ticketCode: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WaitlistEntryEnvelope"];
                };
            };
            404: components["responses"]["NotFound"];
        };
    };
    cancelWaitlistTicket: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                ticketCode: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WaitlistEntryEnvelope"];
                };
            };
            404: components["responses"]["NotFound"];
            409: components["responses"]["ConflictError"];
        };
    };
    updateWaitlistStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["Id"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    status: "notified" | "cancelled" | "no_show";
                };
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WaitlistEntryEnvelope"];
                };
